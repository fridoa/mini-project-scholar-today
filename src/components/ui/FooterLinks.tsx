const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Advertising", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "More", href: "#" },
];

const FooterLinks = () => {
  return (
    <div className="px-4 text-left text-xs leading-relaxed text-gray-400">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {FOOTER_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="hover:underline hover:text-[#ec5b13]">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;
