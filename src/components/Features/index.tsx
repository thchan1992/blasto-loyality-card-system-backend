import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="about" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle title="Main Features" paragraph="" center />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
          <div className="mt-20 grid grid-cols-1 items-center justify-center gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <SectionTitle
                title="Ask your customers to try our Blasta App"
                paragraph="Available on both Platform"
                center
              />
              <div className="flex flex-row justify-evenly">
                <Image
                  src="/images/features/app-store.svg"
                  alt="about image"
                  width={180}
                  height={180}
                  className=""
                />
                <Image
                  src="/images/features/play-store.svg"
                  alt="about image"
                  width={180}
                  height={180}
                  className=""
                />
              </div>
            </div>
            <div className="carousel mt-10 rounded-box border-2 border-white">
              <div className="carousel-item">
                {/* <div className="carousel-item">
                  <img
                    src="images/features/dashboard.png"
                    alt="Burger"
                    className="h-128 w-64 bg-white object-cover"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="images/features/dashboard2.png"
                    alt="Burger"
                    className="h-128 w-64 bg-white object-cover"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="images/features/scanner.png"
                    alt="Burger"
                    className="h-128 w-64 bg-white object-cover"
                  />
                </div> */}
                <img
                  src="images/features/landing.png"
                  alt="Burger"
                  className="h-128 w-64 bg-white object-cover"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="images/features/qr-code.png"
                  alt="Burger"
                  className="h-128 w-64 bg-white object-cover"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="images/features/shop-list.png"
                  alt="Burger"
                  className="h-128 w-64 bg-white object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
