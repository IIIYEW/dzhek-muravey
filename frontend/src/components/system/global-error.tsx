export function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section className="container section state">
      <h1>Страница временно недоступна</h1>
      <p>Попробуйте ещё раз или свяжитесь с магазином.</p>
      <button className="button" onClick={reset}>
        Попробовать снова
      </button>
    </section>
  );
}
