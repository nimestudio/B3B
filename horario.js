// Switch between schedules using filter-button

const lang = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';

function switchSchedule(hostId, btn) {
    document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const iframe = document.getElementById('momence-schedule-frame');
    if (!iframe) return;

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
                    --momenceColorPrimary: #030303;
                    --momenceColorBlack: #030303;
                    --greyscale--black: #030303;
                    --greyscale--white: #fff;
                }

                #momence-plugin-host-schedule .momence-host_schedule {
                    padding: 0px !important;
                }

                #momence-plugin-host-schedule .momence-event_type_select-button > * {
                    display: none !important;
                }

                #momence-plugin-host-schedule .momence-host_schedule-session_list-date_label {
                    font-family: 'Owners Wide', Impact, sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 14px !important;
                    text-transform: capitalize !important;
                    color: var(--greyscale--black) !important;
                    margin-top: 1rem;
                }

                #momence-plugin-host-schedule .momence-view-toggle-list > span, .momence-view-toggle-calendar > span, .momence-quick_filters-all, .momence-quick_filters-today, .momence-month_switch-current, .momence-host_schedule-session_list-expand-button,
                #momence-plugin-host-schedule h3.momence-host_schedule-session_list-item-type {
                    font-family: 'Owners Narrow', Impact, sans-serif !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: .04em !important;
                }

                #momence-plugin-host-schedule h3.momence-host_schedule-session_list-item-type {
                    margin-bottom: 0.5rem;
                }

                #momence-plugin-host-schedule button.momence-event_type_select-button {
                    font-family: 'Owners Wide', Impact, sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 14px !important;
                }

                #momence-plugin-host-schedule {
                    font-family: Concrette, Arial, sans-serif;
                    font-size: 15px!important;
                    font-weight: 400;
                }

                #momence-plugin-host-schedule h4.momence-host_schedule-session_list-item-title,
                #momence-plugin-host-schedule .momence-host_schedule-session_list-item-price > div {
                    font-family: 'Owners Wide', Impact, sans-serif;
                    font-size: 25px;
                    font-weight: 700 !important;
                }

                #momence-plugin-host-schedule .momence-host_schedule-session_list-second-section {
                    font-family: Concrette, Arial, sans-serif;
                    font-size: 15px;
                    font-weight: 400;
                    line-height: 1.33;
                }

                #momence-plugin-host-schedule a[href*="momence.com/s/"] {
                    padding-right: 1.25rem;
                    padding-left: 1.25rem;
                    height: 32px;
                    background-color: var(--greyscale--black);
                    color: var(--greyscale--white);
                    letter-spacing: .04em;
                    text-transform: uppercase;
                    border-radius: 2rem;
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

                #momence-plugin-host-schedule a[href*="momence.com/s/"]:hover {
                    background-color: #3d3d3d;
                    color: #b6b6b6;
                }

                #momence-plugin-host-schedule .momence-host_schedule-session_list-item-booked_button:disabled,
                #momence-plugin-host-schedule button.momence-host_schedule-session_list-item-booked_button[disabled] {
                    background-color: #e8e8e8 !important;
                    color: var(--greyscale--white) !important;
                    cursor: not-allowed !important;
                    border-radius: 2rem;
                    padding-right: 1.25rem;
                    padding-left: 1.25rem;
                    font-family: 'Owners Narrow', Impact, sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1;
                    text-transform: uppercase;
                    letter-spacing: .04em;
                    border: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                #momence-plugin-host-schedule .momence-session-teacher > div > div {
                    font-size: 15px;
                    font-weight: 700;
                }

                #momence-plugin-host-schedule .momence-host_schedule-session_list-item-description {
                    color: var(--greyscale--black) !important;
                    font-size: 15px !important;
                    opacity: 1 !important;
                    line-height: 1.33 !important;
                }

                #momence-plugin-host-schedule .momence-host_schedule-session_list-expand-button {
                    margin-top: 0.5rem !important;
                    margin-bottom: 0.5rem !important;
                    font-size: 13px !important;
                    letter-spacing: .04em;
                }

                #momence-plugin-host-schedule .momence-session-starts_at,
                #momence-plugin-host-schedule .momence-session-duration,
                #momence-plugin-host-schedule .momence-session-in_person {
                    color: var(--greyscale--black) !important;
                    font-size: 15px !important;
                    opacity: 1 !important;
                    line-height: 1.33 !important;
                }

                @media screen and (max-width: 767px) {
                    #momence-plugin-host-schedule .momence-host_schedule-session_list-item-booked_button:disabled,
                    #momence-plugin-host-schedule button.momence-host_schedule-session_list-item-booked_button[disabled],
                    #momence-plugin-host-schedule a[href*="momence.com/s/"] {
                        height: 44px;
                        font-size: 14px;
                    }
                    #momence-plugin-host-schedule .momence-view-toggle-list > span, .momence-view-toggle-calendar > span, .momence-quick_filters-all, .momence-quick_filters-today, .momence-month_switch-current, .momence-host_schedule-session_list-expand-button,
                    #momence-plugin-host-schedule h3.momence-host_schedule-session_list-item-type {
                        font-size: 14px;
                    }
                    #momence-plugin-host-schedule .momence-host_schedule-session_list-expand-button {
                    	font-size: 14px;
                    }
                    #momence-plugin-host-schedule h3.momence-host_schedule-session_list-item-type {
                    	font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div id="ribbon-schedule"></div>
            <script async type="module" host_id="${hostId}" teacher_ids="[]" location_ids="[]" tag_ids="[]" default_filter="show-all" locale="${lang}" src="https://momence.com/plugin/host-schedule/host-schedule.js"><\/script>
            <script>
                const observer = new ResizeObserver(() => {
                    if (window.frameElement) {
                        window.frameElement.style.height = document.documentElement.scrollHeight + 'px';
                    }
                });
                observer.observe(document.body);
            <\/script>
        </body>
        </html>
    `;
    iframe.srcdoc = html;
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.filter-button');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const hostId = this.getAttribute('data-studio-id');
            if (hostId) {
                switchSchedule(hostId, this);
            }
        });
    });

    const activeBtn = document.querySelector('.filter-button.active') || buttons[0];
    const initialHostId = activeBtn.getAttribute('data-studio-id');
    if (initialHostId) {
        switchSchedule(initialHostId, activeBtn);
    }
});