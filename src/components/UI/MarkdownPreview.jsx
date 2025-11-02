// src/components/UI/MarkdownPreview.jsx
// Profesionalna komponenta za prikaz markdown sadržaja
// Dizajnirana sa glassmorphism efektima i modernim animacijama
// Savršeno se uklapa sa ProductDetails stilom
// Props:
// - content: Markdown sadržaj (obavezan)
// - title: Custom naslov dokumenta (opciono)
// - filename: Ime fajla za generisanje naslova (opciono)
// - showIcon: Prikaži ikonicu u headeru (default: true)
// - className: Dodatne CSS klase (opciono, default: "")
// - animationDelay: Delay pre animacije u sekundama (default: 0)
// - maxHeight: Maksimalna visina sadržaja (default: "600px")

import { motion as Motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FileCode, Book } from "lucide-react";

export default function MarkdownPreview({ 
  content, 
  title, 
  filename,
  showIcon = true,
  className = "",
  animationDelay = 0,
  maxHeight = "600px"
}) {
  // Funkcija za izvlačenje čistog naslova iz imena fajla
  const getFileTitle = (name) => {
    if (!name) return "Dokument";
    // Ukloni timestamp i ekstenziju
    const cleanName = name
      .replace(/^\d+_/, '') // Ukloni timestamp
      .replace(/\.md$/i, '') // Ukloni .md
      .replace(/_/g, ' ') // Zameni _ sa razmakom
      .trim();
    return cleanName || "Dokument";
  };

  const displayTitle = title || getFileTitle(filename);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing za smooth animaciju
      }}
      className={`group rounded-2xl backdrop-blur-xl border-2 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px)",
        border: "2px solid rgba(110, 174, 162, 0.25)",
        boxShadow: "0 8px 32px rgba(37, 56, 105, 0.12), 0 2px 8px rgba(110, 174, 162, 0.08)",
      }}
    >
      {/* Header sa naslovom */}
      <Motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: animationDelay + 0.1, duration: 0.4 }}
        className="relative px-5 py-4 sm:px-6 sm:py-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(37, 56, 105, 0.08) 0%, rgba(110, 174, 162, 0.08) 100%)",
          borderBottom: "1.5px solid rgba(110, 174, 162, 0.25)",
        }}
      >
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(135deg, rgba(37, 56, 105, 0.12) 0%, rgba(110, 174, 162, 0.12) 100%)",
          }}
        />
        
        {/* Decorative blur circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sheen/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-midnight/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative flex items-center gap-3">
          {showIcon && (
            <Motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sheen/30 to-bluegreen/30 backdrop-blur-md border border-sheen/40 shadow-lg"
            >
              <FileCode size={20} className="text-midnight" />
            </Motion.div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-midnight flex items-center gap-2 truncate">
              {displayTitle}
            </h3>
            <Motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: animationDelay + 0.3, duration: 0.6 }}
              className="h-1 w-24 bg-gradient-to-r from-sheen to-bluegreen rounded-full mt-1 origin-left"
            />
          </div>

          {/* Decorative icon */}
          <Motion.div
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
            className="hidden md:block"
          >
            <Book size={24} className="text-sheen/40" />
          </Motion.div>
        </div>
      </Motion.div>

      {/* Markdown Content sa prose styling */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: animationDelay + 0.2, duration: 0.5 }}
        className="px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8 overflow-auto custom-scrollbar"
        style={{ maxHeight }}
      >
        <div 
          className="
            prose prose-sm sm:prose-base lg:prose-lg max-w-none
            
            /* Headings */
            prose-headings:text-midnight prose-headings:font-bold 
            prose-headings:tracking-tight
            prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl 
            prose-h1:mb-4 prose-h1:mt-6
            prose-h1:bg-gradient-to-r prose-h1:from-midnight prose-h1:to-charcoal 
            prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl 
            prose-h2:mb-3 prose-h2:mt-5
            prose-h2:text-midnight/90
            prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl 
            prose-h3:mb-2 prose-h3:mt-4
            prose-h3:text-midnight/80
            
            /* Paragraphs */
            prose-p:text-midnight prose-p:leading-relaxed 
            prose-p:mb-4 prose-p:text-base
            
            /* Links */
            prose-a:text-sheen prose-a:no-underline prose-a:font-semibold
            prose-a:transition-all prose-a:duration-200
            hover:prose-a:text-bluegreen hover:prose-a:underline 
            hover:prose-a:decoration-2 hover:prose-a:underline-offset-4
            prose-a:decoration-sheen/50
            
            /* Strong/Bold */
            prose-strong:text-midnight prose-strong:font-bold
            
            /* Code */
            prose-code:text-sheen prose-code:bg-midnight/10 
            prose-code:px-2 prose-code:py-1 prose-code:rounded-md
            prose-code:font-mono prose-code:text-sm prose-code:font-semibold
            prose-code:before:content-[''] prose-code:after:content-['']
            prose-code:border prose-code:border-sheen/20
            
            /* Pre/Code blocks */
            prose-pre:bg-gradient-to-br prose-pre:from-midnight prose-pre:to-charcoal
            prose-pre:text-white prose-pre:rounded-xl 
            prose-pre:shadow-2xl prose-pre:border-2 prose-pre:border-sheen/30
            prose-pre:p-4 sm:prose-pre:p-6
            prose-pre:overflow-x-auto
            
            /* Lists */
            prose-ul:list-none prose-ul:pl-0
            prose-ol:list-none prose-ol:pl-0
            prose-li:text-midnight prose-li:mb-2 prose-li:relative
            prose-li:pl-7 prose-li:before:absolute prose-li:before:left-0
            prose-li:before:top-2 prose-li:before:w-4 prose-li:before:h-4
            prose-li:before:rounded-full prose-li:before:bg-gradient-to-br
            prose-li:before:from-sheen prose-li:before:to-bluegreen
            prose-li:before:shadow-md
            prose-ol:prose-li:before:content-[counter(list-item)]
            prose-ol:prose-li:before:flex prose-ol:prose-li:before:items-center
            prose-ol:prose-li:before:justify-center prose-ol:prose-li:before:text-white
            prose-ol:prose-li:before:text-xs prose-ol:prose-li:before:font-bold
            
            /* Blockquotes */
            prose-blockquote:border-l-4 prose-blockquote:border-sheen
            prose-blockquote:bg-gradient-to-r prose-blockquote:from-sheen/5 prose-blockquote:to-transparent
            prose-blockquote:italic prose-blockquote:text-midnight/80
            prose-blockquote:pl-6 prose-blockquote:py-3
            prose-blockquote:my-6 prose-blockquote:rounded-r-lg
            prose-blockquote:shadow-inner
            
            /* Images */
            prose-img:rounded-xl prose-img:shadow-2xl 
            prose-img:border-2 prose-img:border-sheen/30
            prose-img:transition-transform prose-img:duration-300
            hover:prose-img:scale-105 hover:prose-img:shadow-3xl
            
            /* Horizontal rules */
            prose-hr:border-sheen/30 prose-hr:my-8
            prose-hr:border-2 prose-hr:rounded-full
            
            /* Tables */
            prose-table:border-collapse prose-table:w-full
            prose-table:rounded-xl prose-table:overflow-hidden
            prose-table:shadow-lg prose-table:border-2 prose-table:border-sheen/20
            prose-thead:bg-gradient-to-r prose-thead:from-midnight/10 prose-thead:to-sheen/10
            prose-th:text-midnight prose-th:font-bold prose-th:p-3
            prose-th:border-b-2 prose-th:border-sheen/30
            prose-td:p-3 prose-td:border-b prose-td:border-sheen/10
            prose-tr:transition-colors hover:prose-tr:bg-sheen/5
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content || ""}
          </ReactMarkdown>
        </div>
      </Motion.div>

      {/* Footer decorative element */}
      <Motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: animationDelay + 0.4, duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-transparent via-sheen to-transparent origin-center"
      />
    </Motion.div>
  );
}
