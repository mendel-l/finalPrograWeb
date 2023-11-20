import { Component, OnInit } from "@angular/core";
import { ApiService } from "./api.service";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html"
})

export class TablesComponent implements OnInit {
  data: any;
  tareasList: any[];
  selectedTareaId: number;
  selectedTareaDetails: any;
  closeResult: string;
  nuevaTarea: any = {};

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.apiService.getTareas().subscribe((response) => {
      this.data = response;
      this.tareasList = response.map(tarea => ({ id: tarea.id, nombre: tarea.nombre }));
      this.data.forEach(tarea => {
        tarea.estadoNombre = this.mapEstado(tarea.estado);
      });
    });
  }
  
  mapEstado(codigoEstado: number): string {
    switch (codigoEstado) {
      case 1:
        return 'PENDIENTE';
      case 2:
        return 'CANCELADA';
      case 3:
        return 'COMPLETADA';
      default:
        return 'DESCONOCIDO';
    }
  }
  
  seleccionarTarea() {
    if (this.selectedTareaId) {
      this.apiService.getTareaById(this.selectedTareaId).subscribe((tarea) => {
        this.selectedTareaDetails = tarea;
      });
    }
  }

  abrirModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //POST
  agregarTarea() {
    this.apiService.agregarTarea(this.nuevaTarea).subscribe(
      (response) => {
        console.log('Tarea agregada correctamente', response);
        this.apiService.getTareas().subscribe((tareas) => {
          this.data = tareas;
          this.tareasList = tareas.map(tarea => ({ id: tarea.id, nombre: tarea.nombre }));
        });
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error al agregar la tarea', error);
      }
    );
  }
  
  abrirModalCrear(modal) {
    this.nuevaTarea = {};
    this.modalService.open(modal, { centered: true });
  }

  crearTarea() {
    this.apiService.agregarTarea(this.nuevaTarea).subscribe((response) => {
      console.log(response);
      this.modalService.dismissAll();
      this.ngOnInit();
    });
  }

    //PUT
    actualizarTarea() {
      if (this.selectedTareaId) {
        this.apiService.actualizarTarea(this.selectedTareaId, this.selectedTareaDetails).subscribe(() => {
          this.apiService.getTareas().subscribe((tareas) => {
            this.data = tareas;
            this.tareasList = tareas.map(tarea => ({ id: tarea.id, nombre: tarea.nombre }));
          });
          this.modalService.dismissAll();
        });
      }
    }
  
    //DELETE
    eliminarTarea() {
      if (this.selectedTareaId) {
        this.apiService.eliminarTarea(this.selectedTareaId).subscribe(() => {
          this.apiService.getTareas().subscribe((tareas) => {
            this.data = tareas;
            this.tareasList = tareas.map(tarea => ({ id: tarea.id, nombre: tarea.nombre }));
          });
          this.selectedTareaDetails = null;
        });
      }
    }
}
