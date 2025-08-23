import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/App.css";

const baseSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1000,
  variableWidth: true,
  dotsClass: "my-slick-dots",
  arrows: false,
};

const PostData = ({ post }) => {
  const question = post?.question ?? "";
  const contentText = typeof post?.content === "string" ? post.content : "";
  const images = Array.isArray(post?.mediaUrls)
    ? post.mediaUrls
    : Array.isArray(post?.content)
    ? post.content
    : [];
  const tags = Array.isArray(post?.tags) ? post.tags : [];
  const polls = Array.isArray(post?.polls) ? post.polls : [];

  // Adjust slider behavior based on image count
  const settings = {
    ...baseSettings,
    slidesToShow: Math.min(2, Math.max(1, images.length)),
    infinite: images.length > 1,
    autoplay: images.length > 1,
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-start py-4">
      {question && <div className="text-left text-xs">{question}</div>}

      {contentText && (
        <p className="text-left whitespace-pre-wrap text-sm">{contentText}</p>
      )}

      {images.length > 0 && (
        <Slider {...settings} className="post-slider">
          {images.map((src, index) => (
            <div key={index} className="flex items-center">
              <img
                src={src}
                alt={`Post image ${index + 1}`}
                className="h-28 px-2 rounded-[10%] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      )}

      {/* ✅ Poll rendering */}
      {polls.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {polls.map((option, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
              disabled
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full"
            >
              #{String(tag).replace(/^#/, "")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostData;
