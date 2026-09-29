// Footer — simple original-brand footer with demo links.
export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__brand">Stream<span>Flix</span></p>
      <nav className="footer__links">
        <a href="#!" onClick={(e) => e.preventDefault()}>About</a>
        <a href="#!" onClick={(e) => e.preventDefault()}>Help Centre</a>
        <a href="#!" onClick={(e) => e.preventDefault()}>Terms of Use</a>
        <a href="#!" onClick={(e) => e.preventDefault()}>Privacy</a>
      </nav>
      <p className="footer__note">
        An original Netflix-inspired UI built for learning — not affiliated with Netflix.
        All titles are fictional; images are royalty-free placeholders from picsum.photos.
      </p>
    </footer>
  );
}