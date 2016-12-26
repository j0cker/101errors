<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Lang;
use App;
use Config;
use Auth;

class System extends Controller
{  

  public function system(){
    if (Auth::check()==false) {
      // The user is not logged in...
      return redirect('/');
    }
     $title = Config::get('app.name');
     $lang = Config::get('app.locale');
     $lang = App::getLocale();
     $lang = Lang::getLocale();

     return view('layouts.system.home',["title" => $title, "lang" => $lang]);
   }

   public function timezone(){
     if (Auth::check()==false) {
       abort(403, 'Unauthorized action.');
     }
     $bmsuuh = App\Bmsuuh::all();
     return json_encode($bmsuuh);
   }

   public function configuration(){
     if (Auth::check()==false) {
       abort(403, 'Unauthorized action.');
     }
   }

   public function profile(){
    if (Auth::check()==false) {
      // The user is not logged in...
      return redirect('/');
     }
   }
    //
}
