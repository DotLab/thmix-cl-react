import React from 'react';
import {Link} from 'react-router-dom';

class App extends React.Component {
  render() {
    return <div>
      <section className="Bgc($purple) container shadow text-light pt-4 pb-1">
        <h2 className="font-weight-normal">Touhou Mix Privacy Policy</h2>
      </section>
      <section className="Bgc($gray-700) Px(50px) container shadow text-light py-4">
        <p>In addition to this policy, please also make sure to visit and understand our <Link className="text-warning" to="/terms">Terms of Service</Link>.</p>

        <h3>Introduction</h3>
        <p>Touhou Mix offers a wide variety of services to users from around the world, with a community and opportunities for users to share their creativity
          with others by means of user profiles, MIDI files, SoundFont files, forums, private messages, in-game chat, replay comments.</p>
        <p>In order to offer these services to you, we must often collect, store and transmit personal information. We strive to be as transparent as possible
          in every aspect of running Touhou Mix, and this privacy policy should bring us even closer to that goal.</p>
        <p>This document aims to describe what information we collect on our network and in the use of our products and services, how we use that information
          and what options we offer you to control your personal information.</p>
        <p>By using our service, you confirm that you have read and understood the <Link className="text-warning" to="/terms">Terms of Service</Link> and this
          privacy policy, including how and why we use your information and that your use of the service is subject to the applicable Terms of Service and this
          Privacy Policy. If you do not want us to collect or process your personal information as described herein, you have several choices including limiting
          the information we collect on you, or not using the Network, or our Products and Services.</p>

        <h3>Information we collect</h3>

        <h4 className="C($pink)">On account registration</h4>
        <p>While limited functionality can be enjoyed without an account, it is often required that a user register an account to experience
          certain services. When registering an account, we store</p>
        <ul>
          <li>Your username</li>
          <li>Your email address</li>
          <li>Your password (sha512+salt)</li>
          <li>Your IP address</li>
        </ul>
        <p>This personal information, with the exception of your username and country, is never shared publicly.</p>

        <h4 className="C($pink)">On updating your profile</h4>
        <p>When building up your user profile (which is publicly visible to all other users), you can optionally provide</p>
        <ul>
          <li>Your social media presence (twitter, discord, skype, website)</li>
          <li>Your avatar and profile cover images</li>
          <li>Your signature</li>
        </ul>
        <p>All the above fields are publicly visible but can be withdrawn immediately and permanently at any point from the settings page.</p>

        <h4 className="C($pink)">On uploading user submitted content</h4>
        <p>When posting on the forums, participating in chat or uploading content to our service such as a MIDI file, you are expressly publicising
          all submitted content. In most cases, it can be edited and deleted after submission at your discretion, but in certain sometimes this
          functionality may be locked to maintain relevance and provisioning of service to our user base.</p>
        <p>As an example, if you upload a MIDI file and it is "approved", it becomes the basis for the user base at large to achieve scores on.
          At this point the option to delete a submission will be revoked.</p>

        <h4 className="C($pink)">On logging in to the game client</h4>
        <p>When connecting to our service from the Touhou Mix game client, a client-specific string is submitted to help us identify your current play
          environment. It is created based off a combination of identifiers from your hardware and software configuration and hashed in such a way
          that it contains no personally identifiable information, but can be used to track your access across logins to our service.</p>
        <p>The main purpose of this is to maintain a fair ranking system and help us enforce account security should your account be accessed from
          a compromised location. This is considered private and only stored as long as it is deemed relevant. It is also non-transferrable, and
          has no meaning outside the Touhou Mix ecosystem.</p>

        <h4 className="C($pink)">On playing the game and submitting a score</h4>
        <p>When completing a game session (passing or failing a MIDI file), details on your performance will be automatically submitted to our server.
          The scoring portion of this submission includes game replay data and may be displayed publicly in the Global Leaderboards and on your User
          Profile and can not be deleted or modified.</p>

        <h4 className="C($pink)">Analytics and Logging</h4>
        <p>We utilise error log collection and web analytics which collect technical and usage information as you use our services. This may include
          IP address, your username, browser type and version, time zone setting and location, operating system and platform and other details on what
          devices you use to access our services.</p>
        <p>This collected data is aggregated and only retained as it is useful. Generally the period of retention for non-aggregated data (such as error
          logs) is less than one month, with automatic purge rules.</p>

        <h4 className="C($pink)">Google reCAPTCHA</h4>
        <p>To protect your account and our platform from automated web scraper and password cracker, we use “Google reCAPTCHA” (hereinafter “reCAPTCHA”)
          on our websites. This service is provided by Google Inc., 1600 Amphitheater Parkway, Mountain View, CA 94043, USA (“Google”).</p>
        <p>reCAPTCHA is used to check whether the data entered on our website (such as on a contact form) has been entered by a human or by an automated
          program. To do this, reCAPTCHA analyzes the behavior of the website visitor based on various characteristics. This analysis starts automatically
          as soon as the website visitor enters the website. For the analysis, reCAPTCHA evaluates various information (e.g. IP address, how long the
          visitor has been on the website, or mouse movements made by the user). The data collected during the analysis will be forwarded to Google.</p>
        <p>The reCAPTCHA analyses take place completely in the background. Website visitors are not advised that such an analysis is taking place.</p>
        <p>Data processing is based on Art. 6 (1) (f) DSGVO. The website operator has a legitimate interest in protecting its site from abusive automated
          crawling and spam.</p>
        <p>For more information about Google reCAPTCHA and Google’s privacy policy, please visit the following links:
          <a className="text-warning" href="https://www.google.com/intl/en/policies/privacy/">https://www.google.com/intl/en/policies/privacy/</a> and
          <a className="text-warning" href="https://www.google.com/intl/en/policies/terms/">https://www.google.com/intl/en/policies/terms/</a>.</p>

        <h3>Disclosures of your personal data</h3>
        <p>We do not perform any marketing, advertising nor send any unsolicited emails. The only emails you will receive from us are the result of an
          action on our service (such as requesting two-factor authentication, purchasing a product or enabling notifications for a discussion).</p>
        <p>We may share your personal data with third parties in very specific cases:</p>
        <ul>
          <li>Where you have expressly made information public</li>
          <li>To process your customer service tickets (we use GitHub)</li>
          <li>In order to improve our service, via error logging</li>
        </ul>

        <h3>Your rights and control</h3>
        <p>As a user you have the right to migrate, update or delete your personal information. This can be done primarily from the user settings,
          or where not available from a localized "Edit" feature on the relevant section of our site. In cases you wish to programmatically retrieve
          your full account data, please use our public API.</p>
        <p>In many cases, user submissions such as forum posts and MIDI files can be deleted on an individual basis. You will find delete buttons
          directly associated with the items that can be deleted.</p>
        <p>If you are covered by the European Union, you have the option of deleting your account from our service. Please note that this is currently
          a manual process and may take several days to complete (contact us to file a request). In the case of account deletion, portions of your
          public contributions may remain intact, as detailed in "Information we collect".</p>
        <p>As we have a strict one-account-per-user policy to maintain fair leaderboards, after account deletion you may not be able to return to our
          service. To enforce this, we will also maintain the unique identifying string as mentioned in "Information we collect".</p>

        <h3>Cookies</h3>
        <p>We use cookies, as does the rest of the internet. We strictly use them to maintain your session state and login credentials across multiple
          sessions. If you're allergic to cookies, please do not use our services.</p>

        <h3>Data security</h3>
        <p>Security is very important to us. Touhou Mix follows accepted standards to protect your personal information during processing, transferring, and
          storage. We reject HTTP requests to ensure all sites on our domain are encrypted via TLS and maintain high standards in data security for access
          to our servers, restricting access to your personal data when we do not need to access it.</p>
        <p>We also regularly purge data on an ongoing and automatic basis as to only keep as much historical data as necessary to perform our legitimate
          business interests.</p>

        <h3>Children</h3>
        <p>Touhou Mix services are not designed for children under the age of 13. If we discover that a person under the age of 13 has submitted personal
          information to us without parental permission, we will endeavour to delete the information from our systems.</p>

        <h3>Data Controller</h3>
        <p>Hi, I am Shinya and I am your data controller. If you have any privacy concerns or requests to exercise your legal rights, don't hesitate to
          contact me directly at the address listed below.</p>
        <p>Email: <a className="text-warning" href="mailto:shinya3@yahoo.com">shinya3@yahoo.com</a> (24 hour response guaranteed)</p>
      </section>
    </div>;
  }
}

export default App;
