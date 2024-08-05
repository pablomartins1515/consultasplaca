import React from "react";
import Script from 'next/script';

// este compoente não está utilizado ainda. Só o do index principal no doc do pages

const GoogleAnalytics = () => {
  return (
    <>
      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-L7EWJJVKGL"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L7EWJJVKGL');
          `,
        }}
      />
      {/* End Google Analytics */}
    </>
  );
};

export default GoogleAnalytics;
