function comprobarPin(pinIntroducido) {
  let pinGuardado = "1234";
  if (pinIntroducido === pinGuardado) return "Acceso permitido";
  return "Acceso denegado";
}
console.log(comprobarPin("1234"));
console.log(comprobarPin(" 1234 "));