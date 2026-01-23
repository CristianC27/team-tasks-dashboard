# team-tasks-dashboard
Prueba tecnica de NSERIO
(.NET 8, Angular, PostgreSQL)

Descripcion:
TeamTasks es una aplicación pensada para facilitar la gestión de proyectos y tareas en equipos de desarrollo.
Con ella puedes crear proyectos, asignar tareas a distintos miembros, definir prioridades y estados, y consultar reportes gráficos que muestran el avance del trabajo.
La interfaz está construida como una SPA en Angular, integrando librerías de gráficos y alertas globales que mejoran la experiencia de uso.

Supuestos y Decisiones de Diseño
-Cada proyecto agrupa un conjunto de tareas que pueden asignarse a desarrolladores activos.
-Las tareas cuentan con prioridades (Low / Medium / High) y estados definidos (ToDo / InProgress / Completed / Blocked).
-La complejidad de cada tarea se mide en una escala del 1 al 5.
-La SPA (Angular) y la API (Node/Express) se desarrollan de forma independiente, comunicándose mediante REST.
-Se emplea SweetAlert2 para las alertas globales y ng2-charts/Chart.js para la generación de gráficos.
-La base de datos utilizada es PostgreSQL 17, configurada a través de variables de entorno.
-En el archivo .gitignore se excluyen los temporales de Visual Studio, node_modules y los builds de Angular.

Requisitos
-Node.js  16 o superior
-npm
-PostgreSQL 17
-Angular CLI 16 o superior
-Git

Instalar:
-Clonar el repositorio:
https://github.com/CristianC27/team-tasks-dashboard.git
