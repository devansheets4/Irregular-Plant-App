import {Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export interface Remote {
  value: string;
  viewValue: string;
}

export interface RemoteGroup {
  disabled?: boolean;
  name: string;
  remote: Remote[];
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;



  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}
  remote = new FormControl();
  remoteGroups: RemoteGroup[] = [
    {
      name: 'Sugar Grove',
      remote: [
        {value: 'SUGAR GROVE', viewValue: 'SGGV'},
        {value: 'BEAVER DAM', viewValue: 'BDAM'},
        {value: 'BEECH CREEK', viewValue: 'BEEC'},
        {value: 'BROWN BROS', viewValue: 'BROW'},
        {value: 'BYPASS', viewValue: 'BYPA'},
        {value: 'FOREST GROVE', viewValue: 'FORE'},
        {value: 'MAST', viewValue: 'MAST'},
        {value: 'RUSH BRANCH', viewValue: 'RUSH'},
        {value: 'VALLE CAY', viewValue: 'VCAY'},
        {value: 'VANDERPOOL', viewValue: 'VAND'},
        {value: 'BETHEL', viewValue: 'BTHL'},
        {value: 'GREEN VALLEY / TIMBER RIDGE', viewValue: 'GVTR'},
        {value: 'JUNALUSKA', viewValue: 'JUNA'},
        {value: 'MABEL', viewValue: 'MABL'},
        {value: 'MEAT CAMP', viewValue: 'MEAT'},
        {value: 'RICH MOUNTAIN', viewValue: 'RICH'},
        {value: 'ROMINGER', viewValue: 'ROMI'}
      ]
    },
    {
      name: 'Watauga',
      remote: [
        {value: 'WATAUGA CO', viewValue: 'WATG'},
        {value: 'HOUND EARS', viewValue: 'HOUN'},
        {value: 'MATNEY', viewValue: 'MATN'},
        {value: 'SEVEN DEVILS', viewValue: 'SEVE'},
        {value: 'SMOKETREE', viewValue: 'SMOK'},
        {value: 'VALLEY CRUCIS', viewValue: 'VALL'},
        {value: 'WILLOW VALLEY', viewValue: 'WILL'},
        {value: 'YONAHLOSSEE', viewValue: 'YONA'},
        {value: 'HAWKSNEST', viewValue: 'HAWK'},
        {value: 'POPLAR GROVE', viewValue: 'POPG'}
      ]
    },
    {
      name: 'Baldwin',
      remote: [
        {value: 'BALDWIN CO', viewValue: 'BLDW'},
        {value: 'CRANBERRY', viewValue: 'CRSP'},
        {value: 'DEEP GAP', viewValue: 'DEEP'},
        {value: 'ELK RIDGE', viewValue: 'ELKR'},
        {value: 'FLEETWOOD', viewValue: 'FLET'},
        {value: 'GOLF COURSE', viewValue: 'GOLF'},
        {value: 'LAKE ASHE', viewValue: 'LAKE'},
        {value: 'NETTLE KNOB', viewValue: 'NETT'},
        {value: 'ROCK QUARRY', viewValue: 'QUAR'},
        {value: 'ELK CREEK', viewValue: 'ELKC'},
        {value: 'BETHEL', viewValue: 'BETH'},
        {value: 'BUFFALO', viewValue: 'BUFF'},
        {value: 'GUM RIDGE', viewValue: 'GUMR'},
        {value: 'IDEWILD', viewValue: 'IDLE'},
        {value: 'MILL CREEK', viewValue: 'MILL'},
        {value: 'NIKANOR', viewValue: 'NIKA'},
        {value: 'PINE SWAMP', viewValue: 'SWAP'},
        {value: 'STONE BRIDGE', viewValue: 'STON'},
        {value: 'TODD', viewValue: 'TODD'},
        {value: 'WOODFORD', viewValue: 'WOOD'}
      ]
    },
    {
      name: 'Banner Elk',
      remote: [
        {value: 'BANNER ELK CO', viewValue: 'BNEL'},
        {value: 'BEECH CREEK', viewValue: 'BEEC'},
        {value: 'DARK RIDGE', viewValue: 'DARK'},
        {value: 'GRANDFATHER', viewValue: 'GFCO'},
        {value: 'HICKORY NUT', viewValue: 'HICK'},
        {value: 'LINVILLE RIDGE', viewValue: 'LNVL'},
        {value: 'SUGAR MOUNTAIN', viewValue: 'SMTN'},
        {value: 'PIGEON ROOST', viewValue: 'PIGE'},
        {value: 'THE RESERVE', viewValue: 'RESE'},
        {value: 'SMOKETREE', viewValue: 'SMOK'},
        {value: 'SUGARTOP', viewValue: 'SGTP'},
        {value: 'BLUE RIDGE', viewValue: 'BLUE'},
        {value: 'EAGLES NEST', viewValue: 'EAGL'},
        {value: 'DARK RIDGE', viewValue: 'DARK'},
        {value: 'GRANDFATHER GOLF', viewValue: 'GFCO'},
        {value: 'MOSSY CREEK', viewValue: 'MOSS'}
      ]
    },
    {
      name: 'Beech Mountain',
      remote: [
        {value: 'BEECH MOUNTAIN CO', viewValue: 'BEMT'},
        {value: 'PINNACLE', viewValue: 'PINN'},
        {value: 'EMERALD MOUNTAIN', viewValue: 'EMER'},
        {value: 'PINE RIDGE', viewValue: 'PINR'},
        {value: 'WINDRIDGE', viewValue: 'WIND'}
      ]
    },
    {
      name: 'Creston',
      remote: [
        {value: 'CRESTON CO', viewValue: 'CETN'},
        {value: 'COPELAND', viewValue: 'COPE'},
        {value: 'POTTERTOWN', viewValue: 'POTT'},
        {value: 'ROCK CREEK', viewValue: 'ROCK'},
        {value: 'ROTEN', viewValue: 'ROTE'},
        {value: 'SOUP BEAN', viewValue: 'SOUP'},
        {value: 'THREE TOP', viewValue: 'THRE'},
        {value: 'CLIFTON', viewValue: 'CLIF'},
        {value: 'FLATWOODS', viewValue: 'FLAT'},
        {value: 'LITTLE LAUREL', viewValue: 'LILL'},
        {value: 'PEAK', viewValue: 'PEAK'},
        {value: 'SKIN CAMP', viewValue: 'SKIN'}
      ]
    },
    {
      name: 'GLADE CREEK',
      remote: [
        {value: 'GLADE CREEK CO', viewValue: 'GLCK'},
        {value: 'CRAB CREEK', viewValue: 'CRAB'},
        {value: 'EDMONDS', viewValue: 'EDMO'},
        {value: 'ENNICE', viewValue: 'ENIS'},
        {value: 'HARE', viewValue: 'HARE'},
        {value: 'HOOKER', viewValue: 'HOOK'},
        {value: 'LITTLE PINE', viewValue: 'LITT'},
        {value: 'SADDLE MOUNTAIN', viewValue: 'SADD'}
      ]
    },
    {
      name: 'LANSING',
      remote: [
        {value: 'LANSING CO', viewValue: 'LNNG'},
        {value: 'APPLE GROVE', viewValue: 'APPL'},
        {value: 'FARMERS STORE', viewValue: 'FARM'},
        {value: 'SUSSEX', viewValue: 'SUSS'},
        {value: 'HELTON', viewValue: 'HELT'},
        {value: 'STURGILLS', viewValue: 'STUR'},
        {value: 'TUCKERDALE', viewValue: 'TUCK'},
        {value: 'WARRENSVILLE', viewValue: 'WARR'},
        {value: 'WEAVERS FORD', viewValue: 'WEAV'},
        {value: 'BIG HORSE', viewValue: 'BIGH'},
        {value: 'CLAYBANK', viewValue: 'CLAY'},
        {value: 'COMET', viewValue: 'COMT'},
        {value: 'GRASSY CREEK', viewValue: 'GRAS'},
        {value: 'HUSK', viewValue: 'HUSK'},
        {value: 'LIBERTY GROVE', viewValue: 'LIBE'},
        {value: 'OAK HILL', viewValue: 'OAKH'}
      ]
    },
    {
      name: 'NATHANS CREEK',
      remote: [
        {value: 'NATHANS CREEK CO', viewValue: 'NTCK'},
        {value: 'BRISTOL', viewValue: 'BRIS'},
        {value: 'CRUMPLER', viewValue: 'CRUM'},
        {value: 'HUCKLEBERRY', viewValue: 'HUCK'},
        {value: 'JEFFERSON', viewValue: 'JEFF'},
        {value: 'LAUREL SPGS', viewValue: 'LAUR'},
        {value: 'OBIDS', viewValue: 'OBID'},
        {value: 'SILAS CREEK', viewValue: 'SILA'},
        {value: 'WAGONER', viewValue: 'WAGO'},
        {value: 'WEST JEFFERSON', viewValue: 'WJFF'},
        {value: 'BARE CREEK', viewValue: 'BARE'},
        {value: 'CHESTNUT HILL', viewValue: 'CHES'},
        {value: 'GENTRY', viewValue: 'GENT'},
        {value: 'GLENDALE SPRINGS', viewValue: 'GLEN'},
        {value: 'HUCKLEBERRY RIDGE BUILDING', viewValue: 'HRGE'},
        {value: 'ROE HUNT', viewValue: 'ROEH'}
      ]
    },
    {
      name: 'SCOTTVILLE',
      remote: [
        {value: 'SCOTTVILLE CO', viewValue: 'SCVL'},
        {value: 'HWY 113N', viewValue: 'NORT'},
        {value: 'PEACHBOTTOM', viewValue: 'PEAC'},
        {value: 'NORTH', viewValue: 'NORT'},
        {value: 'PRATHERS CREEK', viewValue: 'PRAT'},
        {value: 'RIVER', viewValue: 'RIVR'}
      ]
    },
    {
      name: 'SHADY VALLEY',
      remote: [
        {value: 'SHADY VALLEY CO', viewValue: 'SHVY'}
      ]
    },
    {
      name: 'SPARTA',
      remote: [
        {value: 'SPARTA CO', viewValue: 'SPRT'},
        {value: 'AIR BELLOWS', viewValue: 'AIRB'},
        {value: 'BULLHEAD', viewValue: 'BULL'},
        {value: 'JANE TAYLOR', viewValue: 'JANE'},
        {value: 'LAUREL GLEN', viewValue: 'LGLN'},
        {value: 'NEW HAVEN', viewValue: 'NEWH'},
        {value: 'STRATFORD', viewValue: 'STRA'},
        {value: 'WHITEHEAD', viewValue: 'WHIT'},
        {value: 'WOLFE RD', viewValue: 'WOLF'},
        {value: 'PULL TAIL', viewValue: 'PULL'},
        {value: 'TURKEY KNOB', viewValue: 'TURK'},
        {value: 'TWIN OAKS', viewValue: 'TWIN'},
        {value: 'VOXX', viewValue: 'VOXX'}
      ]
    },
    {
      name: 'WEST JEFFERSON',
      remote: [
        {value: 'BEAVER CREEK', viewValue: 'BEAV'},
        {value: 'BOARD OF EDUCATION', viewValue: 'BOED'},
        {value: 'BUCK MOUNTAIN', viewValue: 'BUCK'},
        {value: 'EAST JEFFERSON', viewValue: 'EAST'},
        {value: 'HEADQUARTERS', viewValue: 'HEAD'},
        {value: 'HIGH SCHOOL', viewValue: 'ACHS'},
        {value: 'LUTHER ROAD', viewValue: 'LUTH'},
        {value: 'WEST JEFFERSON', viewValue: 'WEST'}
      ]
    },
    {
      name: 'BOONE',
      remote: [
        {value: 'BYBO', viewValue: 'BYBO'},
        {value: 'BOONE', viewValue: 'BOON'}
      ]
    },
    {
      name: 'LENOIR',
      remote: [
        {value: 'LENOIR', viewValue: 'LENO'}
      ]
    },
    {
      name: 'MOUNTAIN CITY',
      remote: [
        {value: 'MOUNTAIN CITY', viewValue: 'MTNC'}
      ]
    },
    {
      name: 'CHESNEE',
      remote: [
        {value: 'CHESNEE CO', viewValue: 'SPRT'},
        {value: 'CHESNEE REMOTE 2', viewValue: 'REM2'},
        {value: 'CHESNEE REMOTE 3', viewValue: 'REM3'},
        {value: 'CHESNEE REMOTE 5', viewValue: 'REM5'},
        {value: 'CHESNEE REMOTE 6', viewValue: 'REM6'},
        {value: 'CHESNEE REMOTE 7', viewValue: 'REM7'},
        {value: 'CHESNEE REMOTE 8', viewValue: 'REM8'},
        {value: 'CHESNEE REMOTE 9', viewValue: 'REM9'},
        {value: 'CHESNEE REMOTE 10', viewValue: 'REM10'}
      ]
    }
  ];




  ngOnInit() {

    this.authStatusSub = this.authService
    .getAuthStatusListiner()
    .subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({
      title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
      content: new FormControl(null, {
          validators: [Validators.required]
        }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
        }),
      route: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)]
        }),
      remote: new FormControl(null, {
          validators: [Validators.required]
        })
    });



    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');


        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            route: postData.route,
            remote: postData.remote,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
            route: this.post.route,
            remote: this.post.remote
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }









  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }









  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
         this.form.value.route,
         this.form.value.remote
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.route,
         this.form.value.remote);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
