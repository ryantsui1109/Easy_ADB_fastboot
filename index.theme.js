const darkTheme = `body {
    background-color: rgba(0, 0, 0,0.4);
    color: rgba(255, 255, 255, 0);
  }
  .card {
    border-color: rgba(255, 255, 255, 1);
    background-color: rgba(0, 0, 0,0);
    color: rgba(255, 255, 255, 1);
  }
  .nav {
    --bs-nav-link-color: #317af7;
  }
  .btn-primary {
    --bs-btn-bg: #317af7;
  }
  .form-check-input:checked {
    background-color: #317af7;
  }
  .card{
    border-radius: 0;
    border: 0;
   
  }
  .darkHr{
    display: block;
  }
  hr.darkHr{
    opacity:1;
    border-top:2px solid;
    border-top-color:white;
    color:white;
  }
  
  .modal-content{
    background-color:rgb(0,0,0);
    border: 1px solid rgb(222, 226, 230);
  }
  
  
  `;
const autoTheme = `
.darkHr{
  display:none
}
@media (prefers-color-scheme: dark) {
  ${darkTheme}
}`;

const lightTheme = `.darkHr{
  display:none
}
`;
exports.darkTheme = darkTheme;
exports.autoTheme = autoTheme;
exports.lightTheme = lightTheme;
