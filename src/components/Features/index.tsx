import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Main Features"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="carousel mt-10 rounded-box border-2 border-white">
              <div className="carousel-item">
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
              <div className="carousel-item">
                <img
                  src="images/features/shop-list.png"
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
        </div>
      </section>
    </>
  );
};

export default Features;
