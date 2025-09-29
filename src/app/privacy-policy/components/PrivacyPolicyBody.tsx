// src/app/privacy-policy/components/PrivacyPolicyBody.tsx

import React from 'react';
import styles from './PrivacyPolicyBody.module.css'; // Import the CSS module

// FIX: Changed React.VFC to the correct type, React.FC
const PrivacyPolicyBody: React.FC = () => {
  return (
    <div className={styles.event1}>
      <div className={styles.container}>
        
        {/* Section 1: Introduction */}
        <section className={styles.sectionTitle}>
          <p className={styles.text1}>
            At datalpse, accessible from https://www.pejuangtender.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by datalpse and how we use it.

            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
        </section>
        
        {/* Section 2: Log Files */}
        <section className={styles.sectionTitle}>
          <p className={styles.text2}>Log Files</p>
          <p className={styles.text3}>
            pejuang tender follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&rsquo; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&rsquo; movement on the website, and gathering demographic information.
          </p>
        </section>
        
        {/* Section 3: Cookies and Web Beacons */}
        <section className={styles.sectionTitle}>
          <p className={styles.text4}>Cookies and Web Beacons</p>
          <p className={styles.text5}>
            Like any other website, datalpse uses &apos;cookies&apos;. These cookies are used to store information including visitors&rsquo; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&rsquo; experience by customizing our web page content based on visitors&rsquo; browser type and/or other information.

            For more general information on cookies, please read the &quot;Cookies&quot; article from the Privacy Policy Generator.
          </p>
        </section>
        
        {/* Section 4: Privacy Policies */}
        <section className={styles.sectionTitle}>
          <p className={styles.text6}>Privacy Policies</p>
          <p className={styles.text7}>
            You may consult this list to find the Privacy Policy for each of the advertising partners of datalpse.

            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on datalpse, which are sent directly to users&rsquo; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.

            Note that datalpse has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>
        
        {/* Section 5: Third Party Privacy Policies */}
        <section className={styles.sectionTitle}>
          <p className={styles.text8}>Third Party Privacy Policies</p>
          <p className={styles.text9}>
            pejuang tender&rsquo;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&rsquo; respective websites. What Are Cookies?
          </p>
        </section>
        
        {/* Section 6: Children's Information */}
        <section className={styles.sectionTitle}>
          <p className={styles.text10}>Children&rsquo;s Information</p>
          <p className={styles.text11}>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

            datalpse does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>
        
        {/* Section 7: Online Privacy Policy Only */}
        <section className={styles.sectionTitle}>
          <p className={styles.text12}>Online Privacy Policy Only</p>
          <p className={styles.text13}>
            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in datalpse. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>
        </section>
        
        {/* Section 8: Consent */}
        <section className={styles.sectionTitle}>
          <p className={styles.text14}>Consent</p>
          <p className={styles.text15}>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </section>
        
      </div>
    </div>
  );
};

export default PrivacyPolicyBody;