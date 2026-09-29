document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-button');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      switchForm(
        this.getAttribute('data-host-id'),
        this.getAttribute('data-token'),
        this.getAttribute('data-source'),
        this
      );
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  let studioSlug = urlParams.get('studio');
  
  if (studioSlug) {
    studioSlug = studioSlug.replace(/^\/?en\//i, '');
  }

  let targetButton = studioSlug ? document.querySelector(`[data-slug$="${studioSlug}"]`) : null;

  if (!targetButton) {
    targetButton = document.querySelector('.filter-button.active') || buttons[0];
  }

  if (targetButton) {
    targetButton.click();
  }
});

function switchForm(hostId, token, source, btn) {
  document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const container = btn.parentElement;
  if (container) {
    const scrollPos = btn.offsetLeft - (container.offsetWidth / 2) + (btn.offsetWidth / 2);
    container.scrollTo({ left: scrollPos, behavior: 'smooth' });
  }

  const iframe = document.getElementById('momence-form-frame');
  if (!iframe) return;

  const lang = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';
  
  const redirectUrl = lang === 'en' ? 'https://b3bwomanstudio.com/en/gracias-clase' : 'https://b3bwomanstudio.com/gracias-clase';
  const labelName = lang === 'en' ? 'Full name' : 'Nombre y apellidos';
  const labelPhone = lang === 'en' ? 'Phone' : 'Teléfono';
  const labelDate = lang === 'en' ? 'Date of birth' : 'Fecha de nacimiento';
  const btnText = lang === 'en' ? 'Book class' : 'Reservar clase';
  const privacyText = lang === 'en' ? 'I have read and understood the ' : 'He leído y entiendo la ';
  const privacyLinkText = lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad';
  const privacyUrl = lang === 'en' ? '/en/politica-de-privacidad' : '/politica-de-privacidad';

  const fieldDef = JSON.stringify({
    "fullName": {"type": "text", "label": labelName, "required": true, "hidden": false},
    "email": {"type": "email", "label": "Email", "required": true},
    "phoneNumber": {"type": "phone-number", "label": labelPhone, "required": false, "hidden": false},
    "birthDate": {"type": "date", "label": labelDate, "required": true, "hidden": false}
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @font-face {
          font-family: Concrette;
          src: url("https://cdn.prod.website-files.com/6a6468714fc7c4945835d72b/6a6469671039aed5d0944db9_ConcretteM-Regular.woff2") format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: Concrette;
          src: url("https://cdn.prod.website-files.com/6a6468714fc7c4945835d72b/6a646967cc95dd7bfd96b736_ConcretteM-Bold.woff2") format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: Owners Narrow;
          src: url("https://cdn.prod.website-files.com/6a6468714fc7c4945835d72b/6a64698d04b594e163011616_OwnersNarrow-Bold.woff2") format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: Owners Wide;
          src: url("https://cdn.prod.website-files.com/6a6468714fc7c4945835d72b/6a64698dd024a2c0000388a4_OwnersWide-Bold.woff2") format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        :root {
          --momenceColorBackground: #fff;
          --momenceColorPrimary: 3, 3, 3;
          --momenceColorBlack: 3, 3, 3;
          --momence-primary-200: #e8e8e8;
          --momence-primary-100: #e8e8e8;
          --momence-primary-050: #e8e8e8;
          --greyscale--black: #000000; 
          --greyscale--white: #ffffff;
          --spacing--padding-m: 1rem;
        }
        #momence-plugin-lead-form .momence-lead_form-base_container {
          padding: 2px !important;
        }
        #momence-plugin-lead-form input.momence-lead_form-field_input:not([type="checkbox"]),
        #momence-plugin-lead-form input.form-control,
        #momence-plugin-lead-form button.momence-select-button {
          border: 1px solid #bbb !important;
          border-radius: 2rem !important;
          font-family: 'Concrette', sans-serif !important;
          font-weight: 400 !important;
          font-size: 15px !important;
        }
        #momence-plugin-lead-form .momence-lead_form-field_label {
          font-family: 'Owners Wide', Impact, sans-serif !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          color: var(--greyscale--black) !important;
          margin-top: 1rem;
        }
        #momence-plugin-lead-form input.momence-lead_form-field_input:not([type="checkbox"])::placeholder,
        #momence-plugin-lead-form input.form-control::placeholder {
          font-family: 'Concrette', sans-serif !important;
          font-weight: 400 !important;
          font-size: 15px !important;
          color: #636363;
        }
        #momence-plugin-lead-form .momence-lead_form-submit_btn {
          padding-right: 1.25rem;
          padding-left: 1.25rem;
          background-color: var(--greyscale--black, #000);
          color: var(--greyscale--white, #fff);
          letter-spacing: .04em;
          text-transform: uppercase;
          border-radius: 2rem !important;
          justify-content: center;
          align-items: center;
          font-family: 'Owners Narrow', Impact, sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition: color .2s, background-color .2s;
          display: flex;
        }
        #momence-plugin-lead-form .momence-lead_form-submit_btn:hover {
          background-color: #3d3d3d;
          color: #b6b6b6;
        }
        #momence-plugin-lead-form label[for="momence-lead_form-input-dataCollectConsent"] {
          font-family: 'Concrette', sans-serif !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          text-transform: none !important;
          color: var(--greyscale--black, #000) !important;
          cursor: pointer;
          line-height: 1.4 !important;
          align-self: center;
          margin: 0px !important;
        }
        #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent {
          -webkit-appearance: none;
          appearance: none;
          outline: 1px solid #bbb;
          border-radius: 4px;
          flex: none;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0;
          margin-left: 0;
          margin-right: 6px;
          background-color: #fff;
          cursor: pointer;
          border: 3px solid transparent;
        }
        #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent:checked {
          background-image: none !important;
          border-color: #ffffff !important;
          box-shadow: none !important;
          background-color: var(--greyscale--black);
          outline: 1px solid #bbb;
        }
        #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent:focus,
        #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent:focus-visible,
        #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent:active {
          outline: 1px solid #bbb !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
          border: 3px solid transparent;
        }
        .text-small-caps.inline-link {
          font-family: 'Owners Narrow', Impact, sans-serif;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: var(--greyscale--black);
          white-space: nowrap;
          text-decoration: underline;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 2px;
        }
        .momence-lead_form-field:has(input[name="dataCollectConsent"]) {
  justify-content: center;
}
        @media (max-width: 767px) {
  #momence-plugin-lead-form #momence-lead_form-input-dataCollectConsent {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.5rem;
  }

  #momence-plugin-lead-form label[for="momence-lead_form-input-dataCollectConsent"] {
    font-size: 14px !important;
  }

  #momence-plugin-lead-form .momence-lead_form-submit_btn {
    height: 44px !important;
  }
}
      </style>
    </head>
    <body>
      <div id="momence-plugin-lead-form"></div>
      
      <script
        async
        type="module"
        id="momence-plugin-lead-form-src"
        host_id="${hostId}"
        fields="fullName,email,phoneNumber,birthDate"
        token="${token}"
        country_code="es"
        source_id="${source}"
        data_collect_consent="required"
        data-field-def='${fieldDef}'
        data-redirect-after-submit-to="${redirectUrl}"
        src="https://momence.com/plugin/lead-form/lead-form.js"
      ><\/script>

      <script>
        const formContainer = document.getElementById('momence-plugin-lead-form');

        if (formContainer) {
          let buttonUpdated = false;
          let labelUpdated = false;

          const mutationObserver = new MutationObserver((mutations, obs) => {
            const submitButton = formContainer.querySelector('.momence-lead_form-submit_btn, button[type="submit"]');
            const checkboxLabel = formContainer.querySelector('label[for="momence-lead_form-input-dataCollectConsent"]');
            
            if (submitButton && !buttonUpdated) {
              if (submitButton.tagName === 'INPUT') {
                submitButton.value = '${btnText}';
              } else {
                submitButton.textContent = '${btnText}';
              }
              buttonUpdated = true;
            }

            if (checkboxLabel && !labelUpdated) {
              checkboxLabel.innerHTML = '${privacyText}<a href="${privacyUrl}" target="_top" class="text-small-caps inline-link">${privacyLinkText}</a>.';
              labelUpdated = true;
            }

            if (buttonUpdated && labelUpdated) {
              obs.disconnect();
            }
          });

          mutationObserver.observe(formContainer, {
            childList: true,
            subtree: true
          });
        }

        const resizeObserver = new ResizeObserver(() => {
          if (window.frameElement) {
            window.frameElement.style.height = document.documentElement.scrollHeight + 'px';
          }
        });
        
        resizeObserver.observe(document.body);
      <\/script>
    </body>
    </html>
  `;
  iframe.srcdoc = html;
}