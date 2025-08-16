import { Check, Edit, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Inputs = ({ value, onChange, label, placeholder, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="mb-6 group">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-3 group-focus-within:text-violet-600 transition-colors">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center bg-gray-50 border-2 px-4 py-3 rounded-xl transition-all duration-300 ${
          isFocused
            ? "border-violet-500 ring-4 ring-violet-500/20 shadow-lg shadow-violet-500/10"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === "password" && (
          <button
            type="button"
            className="text-gray-500 hover:text-violet-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Inputs;

export const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(preview || null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (preview) setPreviewUrl(preview);
  }, [preview]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreview?.(url);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl(null);
    setPreview?.(null);
  };

  const chooseFile = () => inputRef.current.click();

  return (
    <div className="flex justify-center mb-8">
      <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className="hidden" />
      {!previewUrl ? (
        <div
          className={`relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-full cursor-pointer transition-all duration-300 ${hovered ? 'hover:border-violet-500 hover:bg-violet-50' : ''}`}
          onClick={chooseFile}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button type="button" className="absolute -bottom-2 -right-2 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-full transition-all shadow-lg hover:scale-110">
            <Camera size={20} />
          </button>
        </div>
      ) : (
        <div
          className="relative group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg transition-all duration-300 ${hovered ? 'group-hover:border-violet-400' : ''}`} onClick={chooseFile}>
            <img src={previewUrl} alt="profile" className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button type="button" className="w-10 h-10 flex items-center justify-center bg-white/80 text-white rounded-full hover:bg-gray-800 transition-all" onClick={chooseFile}>
              <Edit size={16} />
            </button>
            <button type="button" className="w-10 h-10 flex items-center justify-center bg-red-500 text-red-600 rounded-full hover:bg-white transition-all" onClick={handleRemove}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// USED IN EDIT RESUME
export const TitleInput = ({ title, setTitle }) => {
const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {editing ? (
        <>
          <input
            type="text"
            placeholder="Resume title"
            className={`text-lg sm:text-xl font-bold bg-transparent outline-none text-gray-800 border-b-2 pb-2 transition-all duration-300 ${focused ? 'border-violet-500' : 'border-gray-300'}`}
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />
          <button className= "p-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white transition-all" onClick={() => setEditing(false)}>
            <Check className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
          <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all group" onClick={() => setEditing(true)}>
            <Edit className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
          </button>
        </>
      )}
    </div>
  );
};
