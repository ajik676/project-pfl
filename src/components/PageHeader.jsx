import { FaChevronRight, FaPlus } from "react-icons/fa";

export default function PageHeader({
  title,
  breadcrumb = [],
  children,
  onAdd,
  addLabel,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

      {/* Left: Title & Breadcrumb */}
      <div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 300,
            color: "#0a2540",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h1>

        <div className="flex items-center flex-wrap gap-2 mt-2">
          {Array.isArray(breadcrumb) ? (
            breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <span key={index} className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: isLast ? 600 : 400,
                      color: isLast ? "#1769b0" : "#7a93a8",
                      cursor: isLast ? "default" : "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { if (!isLast) e.currentTarget.style.color = "#0a2540"; }}
                    onMouseLeave={e => { if (!isLast) e.currentTarget.style.color = "#7a93a8"; }}
                  >
                    {item}
                  </span>
                  {!isLast && (
                    <FaChevronRight style={{ fontSize: 9, color: "#b0c4d8", marginTop: 1 }} />
                  )}
                </span>
              );
            })
          ) : (
            <span style={{ fontSize: "0.8rem", color: "#7a93a8" }}>{breadcrumb}</span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="w-full sm:w-auto flex justify-end">
        {children ? (
          children
        ) : onAdd ? (
          <button
            onClick={onAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
            style={{
              background: "#1769b0",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontSize: "0.88rem",
              fontWeight: 500,
              fontFamily: "'Geist', sans-serif",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(23,105,176,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#1258a0";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(23,105,176,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#1769b0";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(23,105,176,0.3)";
            }}
          >
            <FaPlus style={{ fontSize: 11 }} />
            {addLabel || "Tambah Baru"}
          </button>
        ) : null}
      </div>

    </div>
  );
}