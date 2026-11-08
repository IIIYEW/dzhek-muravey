import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigation } from 'react-router-dom';
import { SiteHeader } from '@/components/layout/header';
import { SiteFooter } from '@/components/layout/footer';
import { PageSeo } from '@/components/system/page-seo';

export function AppLayout() {
  const { pathname, hash } = useLocation();
  const navigation = useNavigation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return (
    <>
      <PageSeo />
      <Link className="skip-link" to={{ pathname, hash: '#content' }}>
        К содержимому
      </Link>
      <SiteHeader />
      {navigation.state !== 'idle' && (
        <div className="navigation-progress" role="status">
          Загружаем страницу…
        </div>
      )}
      <main id="content">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
