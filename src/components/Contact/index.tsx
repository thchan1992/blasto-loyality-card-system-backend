"use client";
import { handleSupportAPI } from "@/lib/api";
import { useState } from "react";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
const Contact = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { handleApiErrors } = useHandleApiErrors();
  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await handleSupportAPI(message, name, email);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };
  return (
    <section
      id="contact"
      className="bg-primaryColor overflow-hidden py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        {/* <div className="-mx-4 flex flex-wrap"> */}
        <div className="w-full px-4  xl:w-10/12">
          <div
            className="wow fadeInUp bg-thirdColor dark:bg-thirdColor mb-12 rounded-md px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
            data-wow-delay=".15s
              "
          >
            <h2 className="text-primaryColor dark:text-primaryColor mb-3 text-2xl font-bold sm:text-3xl lg:text-2xl xl:text-3xl">
              {!sent
                ? "Need Help? Send us a email."
                : "Your email has been sent."}
            </h2>
            <p className="text-primaryColor mb-12 text-base font-medium">
              Our support team will get back to you ASAP via email.
            </p>
            <form onSubmit={sendEmail}>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="text-primaryColor dark:text-primaryColor mb-3 block text-sm font-medium"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="dark:bg-primaryColor w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="text-primaryColor dark:text-primaryColor mb-3 block text-sm font-medium"
                    >
                      Your Email
                    </label>
                    <input
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      type="email"
                      placeholder="Enter your email"
                      className="dark:bg-primaryColor w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp"
                    />
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      htmlFor="message"
                      className="text-primaryColor dark:text-primaryColor mb-3 block text-sm font-medium"
                    >
                      Your Message
                    </label>
                    <textarea
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      name="message"
                      rows={5}
                      placeholder="Enter your Message"
                      className="dark:bg-primaryColor w-full resize-none rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full px-4">
                  {!sent && (
                    <button
                      className="bg-fifthColor rounded-md px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      // onClick={() => {
                      //   sendEmail();
                      // }}
                    >
                      Submit Ticket
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
