import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-10">
    <div className="container flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <p className="text-lg font-bold text-foreground">
          Sharp<span className="text-primary">Look</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Умный поиск одежды из разных магазинов</p>
      </div>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <Link to="/about" className="transition-colors hover:text-primary">О проекте</Link>
        <a href="#" className="transition-colors hover:text-primary">Политика конфиденциальности</a>
      </div>
    </div>
  </footer>
);

export default Footer;
