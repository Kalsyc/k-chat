import { HttpHeaders } from '@angular/common/http';

export interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}
