package com.souvik.library.service;

import com.souvik.library.models.InitialSearchListModel;
import com.souvik.library.models.InitialSearchModel;
import org.json.simple.parser.ParseException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReadBengaliBooksScrapper implements IScrapperService {
    @Override
    public InitialSearchListModel retrieveBooks(String queryString) throws ParseException {
        String _url = "https://readbengalibooks.com/catalogsearch/result/?q=" + queryString;
        List<InitialSearchModel> books = new ArrayList<>();
        InitialSearchListModel model = new InitialSearchListModel();
        try {
            Document doc = null;

            doc = Jsoup.connect(_url).get();

            Elements elements = doc.select(".item.product");

            for (Element element : elements) {
                InitialSearchModel book = new InitialSearchModel();
                Element e = element.select(".product-item-photo").first();
                //Get Main page
                String mainPage = e.attr("href");
//            System.out.println(mainPage);
                book.setDetailsURL(mainPage);
                //get Image
                Element img = e.select("img").first();
                String image = img.attr("src");
//            System.out.println(image);
                book.setImage(image);
                String productName = element.select(".product-item-link").first().html();
//            System.out.println(productName);
                book.setBookName(productName);
                Elements authandpub = element.select(".author-name");
                int i = 0;
                for (Element el : authandpub) {
                    if (i == 0) {
                        String authorName = el.select(".author-name").first().select("span").first().html();

                        authorName = authorName.substring(0, authorName.length() - 1);
//                    System.out.println(authorName);
                        book.setAuthor(authorName);
                    } else {
                        String publisher = el.select(".author-name").first().select("span").first().html();
                        publisher = publisher.substring(0, publisher.length() - 1);
//                    System.out.println(publisher);
                        book.setPublicastion(publisher);
                    }
                    i++;
                }

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
            Document doc = null;

            doc = Jsoup.connect(_url).get();

            Element bengaiHeading = doc.select(".au-style").first();

            if (bengaiHeading != null) {
                model.setBookName(bengaiHeading.html());
            }

            model.setBookNameInEnglish(doc.select(".base").first().html());
            model.setPrice(Double.parseDouble(doc.select(".price").first().html().replace("₹","").replace(",","").toString()));
            //Get Description
            Element desc = doc.select(".product.attribute.description").first();
            if (desc != null) {
                String desctiption = "";

                Elements paragraphs = desc.child(0).children();
                for (Element e : paragraphs) {
                    desctiption += e.html() + "\n";
                }

                model.setDescription(desctiption);
            }

            //Get Binding, ISBN, Publishing Year
            Elements tds = doc.select("td");



            for (Element td : tds) {
                if (td.attr("data-th").equals("Binding")) {

                    model.setFormat(td.html());
                }else if(td.attr("data-th").equals("SKU")){
                    String isbn=td.html();
                    isbn = isbn.replaceAll("[^0-9]", "");
                    model.setIsbn(isbn);
                }else if(td.attr("data-th").equals("Publishing Year")){
                    model.setPublishigYear(td.html());
                }else if(td.attr("data-th").equals("Languages")){
                    model.setLanguage(td.html());
                }

            }


            //large image
            String image = doc.select(".gallery-placeholder__image").first().attr("src");
            model.setImage(image);


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