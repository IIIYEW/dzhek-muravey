import { Link } from 'react-router-dom';
import { ShopContacts } from '@/components/shop/shop-sections';
export default function ContactsPage() {
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <p className="breadcrumbs">
            <Link to="/">Главная</Link> / Контакты
          </p>
          <h1>Контакты</h1>
        </div>
      </section>
      <section className="section contacts-body">
        <div className="container">
          <ShopContacts />
        </div>
      </section>
    </>
  );
}
