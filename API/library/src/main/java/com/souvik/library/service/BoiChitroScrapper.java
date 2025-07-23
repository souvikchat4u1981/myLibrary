package com.souvik.library.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.souvik.library.models.InitialSearchListModel;
import com.souvik.library.models.InitialSearchModel;
import org.json.simple.parser.ParseException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class BoiChitroScrapper implements IScrapperService {

    @Override
    public InitialSearchListModel retrieveBooks(String queryString) throws ParseException {
        List<InitialSearchModel> books = new ArrayList<>();
        InitialSearchListModel model = new InitialSearchListModel();
        try {
            String encodedSearchTerm = URLEncoder.encode(queryString, StandardCharsets.UTF_8.toString());
            String urlString = "https://boichitro.in/wp-content/plugins/ajax-search-for-woocommerce-premium/includes/Engines/TNTSearchMySQL/Endpoints/search.php?s=" + encodedSearchTerm;

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            StringBuilder sb = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }

            conn.disconnect();

            String jsonResponse = sb.toString();
            Gson gson = new Gson();
            JsonObject jsonObject = gson.fromJson(jsonResponse, JsonObject.class);
            JsonArray suggestions = jsonObject.getAsJsonArray("suggestions");


            for (JsonElement element : suggestions) {
                JsonObject bookJson = element.getAsJsonObject();
                InitialSearchModel book = new InitialSearchModel();
                book.setBookName(bookJson.has("value") ? bookJson.get("value").getAsString() : null);
                book.setAuthor(bookJson.has("author_name") ? bookJson.get("author_name").getAsString() : null);
                String thumbHtml = bookJson.has("thumb_html") ? bookJson.get("thumb_html").getAsString() : null;
                String imageSrc = null;
                if (thumbHtml != null) {
                    imageSrc = thumbHtml.replaceAll(".*src=['\"]([^'\"]+)['\"].*", "$1");
                }
                book.setImage(imageSrc);
                book.setDetailsURL(bookJson.has("url") ? bookJson.get("url").getAsString() : null);
                // Price and SKU are available but not in InitialSearchModel
                books.add(book);
            }
            model.setFailure(false);
            model.setMessage("SUCCESS");
            model.setBooks(books);
        } catch (Exception e) {
            model.setFailure(true);
            model.setMessage(e.getMessage());
            e.printStackTrace();
        }
        return model;
    }

    @Override
    public InitialSearchModel bookDetails(InitialSearchModel book) {
        InitialSearchModel model = new InitialSearchModel();
        model = book;
        String _url = book.getDetailsURL();
        try {
            Document doc = Jsoup.connect(_url).get();

            Element titleElem = doc.selectFirst("h1.product_title.entry-title");
            if (titleElem != null) {
                String fullTitle = titleElem.text();
                // fullTitle example:
                // "Kaligunin O Chaturanger Faad || Soumik Dey || কালিগুনিন ও চতুরঙ্গের ফাদ || সৌমিক দে"

                // Split by "||" and trim each part
                String[] parts = fullTitle.split("\\|\\|");
                if (parts.length >= 4) {
                    String bookNameInEnglish = parts[0].trim();                // English book name
                    String author = parts[1].trim();                  // English author name
                    String bookName = parts[2].trim();       // Bengali book name
                    // Bengali author name is parts[3], but you only asked for English author here

                    model.setBookName(bookName);
                    model.setAuthor(author);
                    model.setBookNameInEnglish(bookNameInEnglish);
                }
            }

            // Extract image tag within "woocommerce-product-gallery__wrapper" div
            Element imgElem = doc.selectFirst("div.woocommerce-product-gallery__wrapper img.wp-post-image");
            if (imgElem != null) {
                // Usually the main image src is in "src" attribute
                String imageUrl = imgElem.attr("src");
                model.setImage(imageUrl);
            }

            // Extract price (current price inside <p class="price"> > <ins>)
            Element priceElem = doc.selectFirst("p.price ins span.woocommerce-Price-amount");
            if (priceElem != null) {
                String priceText = priceElem.text(); // e.g. "₹191"
                String priceNumber = priceText.replaceAll("[^\\d.]", ""); // strip non-numeric chars
                if (!priceNumber.isEmpty()) {
                    try {
                        double price = Double.parseDouble(priceNumber);
                        model.setPrice(price);
                    } catch (NumberFormatException e) { /* ignore or log */ }
                }
            }

            // Example: Extract Description
            Element descriptionDiv = doc.selectFirst("div.woocommerce-Tabs-panel--description");
            String descriptionText = null;
            if (descriptionDiv != null) {
                // Get the inner HTML or text as needed
//                descriptionText = descriptionDiv.html().trim();
                // Or to get plain text without tags use
                 descriptionText = descriptionDiv.text().trim();
                 model.setDescription(descriptionText);
            }

// Extract from Additional Information table by matching <th> text
            Elements rows = doc.select("table.woocommerce-product-attributes tr");
            for (Element row : rows) {
                Element th = row.selectFirst("th.woocommerce-product-attributes-item__label");
                Element td = row.selectFirst("td.woocommerce-product-attributes-item__value");
                if (th == null || td == null) continue;

                String label = th.text().trim();
                String value = td.text().trim(); // text from <p><a>...</a></p> also included

                switch (label) {
                    case "Publishing Year":
                        model.setPublishigYear(value);
                        break;
                    case "Publisher":
                        model.setPublicastion(value);
                        break;
                    case "Binding":
                        model.setFormat(value);
                        break;
                    case "Language":
                        model.setLanguage(value);
                        break;
                    // Add more cases if needed
                }
            }




            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }
}
