# iCheck Web

Panel web instalable desde Safari para consultar y anotar datos de un iPhone.

## Usarla en iPhone

1. Abre el sitio de iCheck en Safari.
2. Toca **Compartir** y elige **Añadir a pantalla de inicio**.
3. Anota la salud máxima de batería en **Ajustes → Batería → Salud de la batería** y el espacio disponible en **Ajustes → General → Almacenamiento del iPhone**.

La web guarda tus apuntes en el almacenamiento local del navegador de ese dispositivo. No tiene cuenta, analítica, anuncios ni backend. Tras la primera visita puede abrirse sin conexión.

## Límites de iOS

Safari no permite que una página web lea la salud o los ciclos de batería, el almacenamiento total del iPhone, la temperatura exacta ni el uso general de CPU o RAM. El modelo y algunos datos se introducen manualmente. Los núcleos que informa el navegador y la prueba de cálculo son referencias, no un diagnóstico de Apple.

## Desarrollo

Es una web estática, sin dependencias. Abre `index.html` desde un servidor HTTPS para probar la instalación y el modo sin conexión.
