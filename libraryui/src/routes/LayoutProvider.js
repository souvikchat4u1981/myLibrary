import AppLayout from "../common/layout/AppLayout";


const LayoutProvider = ({ component: Component, ...props }) => {
  return (
    <AppLayout>
      <Component {...props} />
    </AppLayout>
  );
};

export default LayoutProvider;
