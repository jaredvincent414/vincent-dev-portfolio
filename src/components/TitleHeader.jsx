const TitleHeader = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white/65 text-xs font-semibold tracking-widest uppercase">{sub}</p>
      <h1 className="font-bold text-5xl md:text-7xl text-center text-white leading-tight tracking-tight">
        {title}<span className="text-white/60">.</span>
      </h1>
    </div>
  );
};

export default TitleHeader;
