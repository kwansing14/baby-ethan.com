const Background = () => {
  const numberOfDots = 1000
  return (
    <div className="bg-black">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: numberOfDots }).map((_, i) => (
          <div key={i} className="h-1 w-1 rounded-full bg-slate-400"></div>
        ))}
      </div>
    </div>
  );
};

export default Background;
