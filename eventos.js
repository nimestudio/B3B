// Logos marquee
const initMarquee = () => {
  const marqueeTracks = document.querySelectorAll('.events-logos-marquee-track');
  
  if (!marqueeTracks.length) return;

  gsap.to(marqueeTracks, {
    xPercent: -100,
    repeat: -1,
    duration: 60,
    ease: "none"
  });
};

// Datepicker
const initDatepicker = () => {
  const dateInput = document.querySelector('.date-input');
  
  if (!dateInput) return;

  const localeEs = {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'hh:mm aa',
    firstDay: 1
  };

  const localeEn = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'hh:mm aa',
    firstDay: 0
  };

  const currentLang = document.documentElement.lang || 'en';
  const selectedLocale = currentLang.toLowerCase().startsWith('es') ? localeEs : localeEn;

  new AirDatepicker('.date-input', {
    locale: selectedLocale,
    autoClose: true
  });
};

// Run scripts
const initPage = () => {
  initMarquee();
  initDatepicker();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}