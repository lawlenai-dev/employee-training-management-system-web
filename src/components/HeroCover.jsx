const sizeStyles = {
  large: {
    section: "min-h-[560px]",
    content: "min-h-[560px] pb-32 pt-28",
    title: "text-4xl sm:text-5xl lg:text-6xl",
    description: "text-base sm:text-lg",
  },

  medium: {
    section: "min-h-[380px]",
    content: "min-h-[380px] py-16",
    title: "text-3xl sm:text-4xl lg:text-5xl",
    description: "text-base sm:text-lg",
  },

  small: {
    section: "min-h-[280px]",
    content: "min-h-[280px] py-12",
    title: "text-3xl sm:text-4xl",
    description: "text-sm sm:text-base",
  },
};

export default function HeroCover({
  size = "medium",
  image = "/training-cover.jpg",
  imagePosition = "center",
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  description,
  children,
  className = "",
}) {
  const styles = sizeStyles[size] ?? sizeStyles.medium;

  return (
    <section
      className={`
        relative overflow-hidden bg-[#001a3d]
        ${styles.section}
        ${className}
      `}
    >
      {/* ภาพปก */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />

      {/* Overlay จากซ้ายไปขวา */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001a3d]/95 via-[#003274]/80 to-[#003274]/35" />

      {/* เงาด้านล่าง */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/70 via-transparent to-transparent" />

      {/* เนื้อหา */}
      <div
        className={`
          relative mx-auto flex max-w-7xl items-center
          px-4 sm:px-6 lg:px-8
          ${styles.content}
        `}
      >
        <div className="max-w-2xl">
          {eyebrow && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
              {EyebrowIcon && <EyebrowIcon size={17} />}

              {eyebrow}
            </div>
          )}

          <h1
            className={`
              font-bold leading-tight text-white
              ${styles.title}
            `}
          >
            {title}

            {highlight && (
              <span className="block text-[#a9c9ef]">
                {highlight}
              </span>
            )}
          </h1>

          {description && (
            <p
              className={`
                mt-6 max-w-xl leading-8 text-white/75
                ${styles.description}
              `}
            >
              {description}
            </p>
          )}

          {children && (
            <div className="mt-8 flex flex-wrap gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}