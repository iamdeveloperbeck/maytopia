
import useCheckUser from "../hooks/useCheckUser";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import images from "../assets/images";

export default function Home() {
  const { type } = useParams();
  const { isLoading } = useCheckUser();

  useEffect(() => {
    const video = document.getElementById("myVideo");
    const handler = () => {
      if (video && video.paused) {
        video.muted = false;
        video.play();
      }
    };

    window.addEventListener("click", handler, { once: true });

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  return (
    <main className="p-4 min-h-screen bg-background">
      {/* Featured YouTube Video Section */}
      <section className="h-screen">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <div className="relative w-[50%] h-full">
            {/* <video
              id="myVideo"
              src="https://youtu.be/0VJbnTBWvcQ?si=5f0Ti4cpmmunE7th"
              controls
              autoPlay
            ></video> */}
            {type === "1" && (
              // <iframe
              //   width="560"
              //   height="315"
              //   src="https://www.youtube.com/embed/0VJbnTBWvcQ?si=FvnDi1uoUbcmtGtU"
              //   title="YouTube video player"
              //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              // ></iframe>
              <div className="">
                <video src="/public/IMG_8427.mp4" controls></video>
              </div>
            )}
            {type === "2" && (
              // <iframe
              //   width="560"
              //   height="315"
              //   src="https://youtu.be/mYdtgSwjkbk?si=6i4_TWpFFLXrw1tC"
              //   title="YouTube video player"
              //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              // ></iframe>
              <div className="">
                <video src="/public/IMG_8432.mp4" controls></video>
              </div>
            )}
          </div>





          {/* Menu Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/menu" className="button-53">
              Menyuni ko'rish
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
