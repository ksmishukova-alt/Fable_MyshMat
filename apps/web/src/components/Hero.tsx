export function Hero({ name }: { name: string }) {
  return (
    <aside className="hero">
      <div className="bubble">
        Привет, {name}!<br />
        Давай начнём<br />с <span>Daily на сегодня</span>
      </div>
      <div className="mascot" />
    </aside>
  );
}
