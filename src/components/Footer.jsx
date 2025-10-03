import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#2F5363] text-[#91CEC1] text-center p-4 mt-8 shadow-inner animate-fadeIn">
      <p>
        Copyright © {new Date().getFullYear()} Vaga Beta<br />
        Designed by{" "}
        <a
          href="https://www.linkedin.com/in/lakishadev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-800 transition-colors"
        >
          lakishadev
        </a>
      </p>
    </footer>
  );
}
