const Footer = () => {
  return (
    <footer className="mt-auto py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm font-medium text-gray-600">
          Crafted with ❤️ by Frido Afriyanto
        </p>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} newdata. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
