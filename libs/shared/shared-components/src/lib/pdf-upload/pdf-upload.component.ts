import { Component, OnInit, Input } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
declare var $: any;

@Component({
  selector: 'general-app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
})
export class PdfUploadComponent implements OnInit {
  @Input() imageUrl: any;
  image: any = '';
  imageExt: any;
  constructor(private valid: SharedHelpersFieldValidationsModule) {}

  ngOnInit(): void {}
  uploadFile(event: any) {
    // console.log(event);
    // console.log(event.target.files[0].type);
    if (event.target.files[0].type == 'application/pdf') {
      this.imageExt = 'pdf';
      let reader = new FileReader(); // HTML5 FileReader API
      let file = event.target.files[0];
      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(',')[1];
        this.image = splitImg;
      };

      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);

        // When file uploads set it to file formcontrol
        reader.onload = () => {
          $('#imagePreview').css(
            'background-image',
            'url(' + reader.result + ')'
          );
          $('#imagePreview').hide();
          $('#imagePreview').fadeIn(650);
        };
      }
    } else {
      this.valid.apiErrorResponse('Only Pdf Image Allowed');
    }
  }
}
