import React from "react";

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-white pt-30 sm:pt-35 md:pt-32 lg:pt-36 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="rounded-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-10">
            Last Updated: June 3, 2026
          </p>

          <div className="space-y-8 sm:space-y-10 text-gray-700">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                1. Introduction
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                Welcome to our platform. These Terms and Conditions govern your
                access to and use of our website, services, applications, and
                related products. By accessing or using our services, you agree
                to comply with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                2. Eligibility
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                You must be at least 18 years old or have the consent of a
                legal guardian to use our services. By using this platform, you
                represent that you meet these requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                3. User Accounts
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                Users may be required to create an account to access certain
                features. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                4. Acceptable Use
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                You agree not to misuse the platform or engage in activities
                that may disrupt, damage, or interfere with the services.
                Prohibited activities include unauthorized access, data
                scraping, distribution of malicious software, and any unlawful
                conduct.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                5. Intellectual Property
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                All content, trademarks, logos, graphics, and software
                available through the platform are the property of the company
                or its licensors and are protected by applicable intellectual
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                6. Payments & Subscriptions
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                Certain services may require payment or subscription fees. All
                fees are non-refundable unless otherwise specified. We reserve
                the right to modify pricing at any time with prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                7. Privacy
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                Your use of the platform is also governed by our Privacy
                Policy. By using the service, you consent to the collection and
                use of information as described therein.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                8. Limitation of Liability
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                To the maximum extent permitted by law, the company shall not
                be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                9. Termination
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                We reserve the right to suspend or terminate access to our
                services at any time, without prior notice, if we believe a
                user has violated these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                10. Changes to Terms
              </h2>
              <p className="text-sm sm:text-base leading-7 sm:leading-8">
                We may update these Terms and Conditions from time to time. Any
                changes will become effective upon posting the revised version
                on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                11. Contact Information
              </h2>

              <p className="text-sm sm:text-base leading-7 sm:leading-8 mb-4">
                If you have any questions regarding these Terms and Conditions,
                please contact us at:
              </p>

              <div className="bg-gray-100 rounded-xl p-4 sm:p-6">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>
                    <strong>Email:</strong> support@example.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (000) 000-0000
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Business Street, City,
                    Country
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;