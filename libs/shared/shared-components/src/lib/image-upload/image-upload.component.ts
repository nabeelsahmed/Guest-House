import { Component, Input, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';

declare var $: any;
@Component({
  selector: 'general-app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Input() imageUrl: any;

  image: any = '';
  imageExt: any;

  constructor(private valid: SharedHelpersFieldValidationsModule) { }

  ngOnInit(): void {
  }

  uploadFile(event: any) {
    
    if(event.target.files[0].type == "image/png"){
      this.imageExt = "png";
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
    }else {
      this.valid.apiErrorResponse('Only Png Image Allowed');
    }
    
  }

}
