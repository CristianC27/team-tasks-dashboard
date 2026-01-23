import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private colors = {
    success: '#10b981', // Verde éxito
    error: '#ef4444', // Rojo peligro
    warning: '#f59e0b', // Ámbar advertencia
    confirm: '#4f46e5', // Indigo (tu color principal)
  };

  constructor() {}

  success(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: this.colors.success,
      allowOutsideClick: false,
      //timer: 3000 // temporizador de 3 segundos
    });
  }

  error(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: this.colors.error,
      allowOutsideClick: false,
    });
  }

  warning(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: this.colors.warning,
      allowOutsideClick: false,
    });
  }
}
