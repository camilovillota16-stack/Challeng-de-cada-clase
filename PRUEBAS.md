# Verificación del Challenge 05

Fecha: 10 de octubre de 2026.

## Pruebas automatizadas

`npm.cmd test`: **12 aprobadas y 0 fallidas**.

- Cola vacía, consulta sin elementos y contador cero.
- Orden FIFO de A, B y C.
- Consulta peek y modificación de la copia de print sin alterar la cola.
- Reutilización después de vaciar e inserciones intercaladas con atención.
- Orden cronológico y desempate por registro ante fechas iguales.
- Nueva llegada anterior a la primera sin alterar la cola original.
- Fechas aleatorias dentro de la última hora y nunca futuras.
- Conversión exacta de montos con coma o punto a centavos.
- Nombre vacío o demasiado largo.
- Montos cero, negativos, inválidos, con tres decimales o fuera del rango seguro.
- Generación de identificador, orden y fecha por el sistema.
- Orden de los datos ficticios con un generador aleatorio controlado.

## Compilación

`npm.cmd run build`: completado con Vite 7.3.7 y Node.js 24.

## Revisión en navegador

| Acción | Resultado observado |
| --- | --- |
| Inicio | Tres personas y fechas de llegada en orden ascendente |
| Registrar monto cero | Mensaje de validación; no agrega una persona |
| Registrar 75000,50 | Monto aceptado, fecha automática y cuatro personas |
| Verificar las fechas de las cuatro filas | Orden cronológico correcto según el atributo datetime |
| Atender cuatro veces | Cada resultado coincidió con la persona que ocupaba el primer lugar |
| Final de la cola | Cero en espera, cuatro atendidas y botón desactivado |
| Registrar después de vaciar | Vuelve a habilitar el botón de atención |
| Recargar | Tres personas iniciales, fechas nuevas y contador de atendidas en cero |
| Computador de 1280 px | Formulario y cola en dos columnas, sin desbordamiento horizontal |
| Teléfono de 390 px | Una columna, sin desbordamiento horizontal |
| Consola | No se registraron errores durante la revisión |

Las personas agregadas para verificar se retiraron y la pantalla quedó con los datos ficticios iniciales. La fecha asignada puede situar un nuevo registro antes de otros pendientes; el orden se prepara antes de encolarlos. La clase Cola conserva FIFO.
