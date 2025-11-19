import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import images from "../assets/images";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DISHES = [
  { id: 1, image: images.menu1 },
  { id: 2, image: images.menu2 },
  { id: 3, image: images.menu3 },
  { id: 4, image: images.menu4 },
  { id: 5, image: images.menu5 },
  { id: 6, image: images.menu6 },
  { id: 7, image: images.menu7 },
];

export default function Dishes() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Asosiy swiper (rasmlar) */}
      <section className="w-full py-8">
        <h1 className="text-center font-bold text-[32px] mb-3">Menu</h1>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className="pb-10"
        >
          {DISHES.map(({ id, image }, index) => (
            <SwiperSlide key={id}>
              <button
                type="button"
                onClick={() => openModal(index)}
                className="w-full h-full block focus:outline-none"
              >
                <img
                  src={image}
                  alt="dish"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Popup (lightbox) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Ichki wrapper (click bubbleni to'xtatish uchun) */}
          <div
            className="relative w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yopish tugmasi */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-10 right-2 text-white text-2xl md:text-3xl"
              aria-label="Close"
            >
              ×
            </button>

            <Swiper
              modules={[Navigation, Pagination, Keyboard]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              initialSlide={activeIndex}
              // @ts-ignore
              onSlideChange={(swiper) =>
                setActiveIndex(swiper.activeIndex)
              }
            >
              {DISHES.map(({ id, image }) => (
                <SwiperSlide key={id}>
                  <div className="w-full max-h-[80vh] flex items-center justify-center">
                    <img
                      src={image}
                      alt="dish big"
                      className="max-h-[80vh] w-auto object-contain rounded-2xl"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}