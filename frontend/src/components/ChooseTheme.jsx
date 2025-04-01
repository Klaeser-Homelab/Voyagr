import { useTheme } from '../context/ThemeContext';

const ChooseTheme = () => {
  const { theme, themeData, handleThemeChange } = useTheme();

  const handleMouseEnter = (themeValue) => {
    document.querySelector('html').setAttribute('data-theme', themeValue);
  };

  const handleMouseLeave = () => {
    document.querySelector('html').setAttribute('data-theme', theme);
  };
  
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Choose your Journey Theme</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(themeData).map(([value, data]) => (
          <div 
            key={value}
            className={`card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-1 basis-[40vw] ${
              theme === value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleThemeChange(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
          >
            <figure>
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-lg">{data.name}</h2>
              <p className="text-sm">{data.description}</p>
              <div className="card-actions justify-end">
                {theme === value ? (
                  <span className="btn btn-neutral">Current</span>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleThemeChange(value)}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseTheme;