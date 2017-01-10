/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.5
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.Lang=factory()}})(this,function(){"use strict";function inferLocale(){if(typeof document!=="undefined"&&document.documentElement){return document.documentElement.lang}}function convertNumber(str){if(str==="-Inf"){return-Infinity}else if(str==="+Inf"||str==="Inf"){return Infinity}return parseInt(str,10)}var intervalRegexp=/^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\-?\d+(\.\d+)?)\s*([\[\]])$/;var anyIntervalRegexp=/({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\-?\d+(\.\d+)?)\s*([\[\]])/;var defaults={locale:"en"};var Lang=function(options){options=options||{};this.locale=options.locale||inferLocale()||defaults.locale;this.fallback=options.fallback;this.messages=options.messages};Lang.prototype.setMessages=function(messages){this.messages=messages};Lang.prototype.getLocale=function(){return this.locale||options.fallback};Lang.prototype.setLocale=function(locale){this.locale=locale};Lang.prototype.getFallback=function(){return this.fallback};Lang.prototype.setFallback=function(fallback){this.fallback=fallback};Lang.prototype.has=function(key,locale){if(typeof key!=="string"||!this.messages){return false}return this._getMessage(key,locale)!==null};Lang.prototype.get=function(key,replacements,locale){if(!this.has(key)){return key}var message=this._getMessage(key,locale);if(message===null){return key}if(replacements){message=this._applyReplacements(message,replacements)}return message};Lang.prototype.trans=function(key,replacements){return this.get(key,replacements)};Lang.prototype.choice=function(key,number,replacements,locale){replacements=typeof replacements!=="undefined"?replacements:{};replacements.count=number;var message=this.get(key,replacements,locale);if(message===null||message===undefined){return message}var messageParts=message.split("|");var explicitRules=[];for(var i=0;i<messageParts.length;i++){messageParts[i]=messageParts[i].trim();if(anyIntervalRegexp.test(messageParts[i])){var messageSpaceSplit=messageParts[i].split(/\s/);explicitRules.push(messageSpaceSplit.shift());messageParts[i]=messageSpaceSplit.join(" ")}}if(messageParts.length===1){return message}for(var j=0;j<explicitRules.length;j++){if(this._testInterval(number,explicitRules[j])){return messageParts[j]}}var pluralForm=this._getPluralForm(number);return messageParts[pluralForm]};Lang.prototype.transChoice=function(key,count,replacements){return this.choice(key,count,replacements)};Lang.prototype._parseKey=function(key,locale){if(typeof key!=="string"||typeof locale!=="string"){return null}var segments=key.split(".");var source=segments[0].replace(/\//g,".");return{source:locale+"."+source,sourceFallback:this.getFallback()+"."+source,entries:segments.slice(1)}};Lang.prototype._getMessage=function(key,locale){locale=locale||this.getLocale();key=this._parseKey(key,locale);if(this.messages[key.source]===undefined&&this.messages[key.sourceFallback]===undefined){return null}var message=this.messages[key.source];var entries=key.entries.slice();while(entries.length&&(message=message[entries.shift()]));if(typeof message!=="string"&&this.messages[key.sourceFallback]){message=this.messages[key.sourceFallback];entries=key.entries.slice();while(entries.length&&(message=message[entries.shift()]));}if(typeof message!=="string"){return null}return message};Lang.prototype._applyReplacements=function(message,replacements){for(var replace in replacements){message=message.split(":"+replace).join(replacements[replace])}return message};Lang.prototype._testInterval=function(count,interval){if(typeof interval!=="string"){throw"Invalid interval: should be a string."}interval=interval.trim();var matches=interval.match(intervalRegexp);if(!matches){throw new"Invalid interval: "+interval}if(matches[2]){var items=matches[2].split(",");for(var i=0;i<items.length;i++){if(parseInt(items[i],10)===count){return true}}}else{matches=matches.filter(function(match){return!!match});var leftDelimiter=matches[1];var leftNumber=convertNumber(matches[2]);var rightNumber=convertNumber(matches[3]);var rightDelimiter=matches[4];return(leftDelimiter==="["?count>=leftNumber:count>leftNumber)&&(rightDelimiter==="]"?count<=rightNumber:count<rightNumber)}return false};Lang.prototype._getPluralForm=function(count){switch(this.locale){case"az":case"bo":case"dz":case"id":case"ja":case"jv":case"ka":case"km":case"kn":case"ko":case"ms":case"th":case"tr":case"vi":case"zh":return 0;case"af":case"bn":case"bg":case"ca":case"da":case"de":case"el":case"en":case"eo":case"es":case"et":case"eu":case"fa":case"fi":case"fo":case"fur":case"fy":case"gl":case"gu":case"ha":case"he":case"hu":case"is":case"it":case"ku":case"lb":case"ml":case"mn":case"mr":case"nah":case"nb":case"ne":case"nl":case"nn":case"no":case"om":case"or":case"pa":case"pap":case"ps":case"pt":case"so":case"sq":case"sv":case"sw":case"ta":case"te":case"tk":case"ur":case"zu":return count==1?0:1;case"am":case"bh":case"fil":case"fr":case"gun":case"hi":case"hy":case"ln":case"mg":case"nso":case"xbr":case"ti":case"wa":return count===0||count===1?0:1;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return count%10==1&&count%100!=11?0:count%10>=2&&count%10<=4&&(count%100<10||count%100>=20)?1:2;case"cs":case"sk":return count==1?0:count>=2&&count<=4?1:2;case"ga":return count==1?0:count==2?1:2;case"lt":return count%10==1&&count%100!=11?0:count%10>=2&&(count%100<10||count%100>=20)?1:2;case"sl":return count%100==1?0:count%100==2?1:count%100==3||count%100==4?2:3;case"mk":return count%10==1?0:1;case"mt":return count==1?0:count===0||count%100>1&&count%100<11?1:count%100>10&&count%100<20?2:3;case"lv":return count===0?0:count%10==1&&count%100!=11?1:2;case"pl":return count==1?0:count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?1:2;case"cy":return count==1?0:count==2?1:count==8||count==11?2:3;case"ro":return count==1?0:count===0||count%100>0&&count%100<20?1:2;case"ar":return count===0?0:count==1?1:count==2?2:count%100>=3&&count%100<=10?3:count%100>=11&&count%100<=99?4:5;default:return 0}};return Lang});

(function () {
    Lang = new Lang();
    Lang.setMessages({"en.auth":{"failed":"These credentials do not match our records.","throttle":"Too many login attempts. Please try again in :seconds seconds."},"en.messages":{"user":"User Name","login":"Login","register":"Register","userormail":"User or Mail","password":"Password","confPassword":"Confirm Password","logfacebook":"Login with Facebook","signfacebook":"Sign up with Facebook","permisosredes":"Don't Worry. We don't publish anything without your permission and we don't save passwords.","nameForm":"Please enter your username","passwordFormRequired":"Please provide a password","passwordFormMinLength":"Your password must be at least 5 characters long","mailForm":"Please enter a valid email address","ResetPassword":"Reset your Password","ResetPasswordButton":"Send Password Reset Link","RememberMe":"Remember Me","Forgot":"Forgot Your Password?","keyPass":134343,"Copyright":"Copyright \u00a9 2016 BFC. All Rights Reserved.","Subscribe":"Subscribe","SubscribeTxt":"Subscribe to our newsletter to receive the latest news.","privacy":"We respect your email privacy.","subscribeSuccess":"An email to confirm your subscription has been sent.","notVerified":"The verification number doesn't exist","verified":"Your account has been verified","wasVerified":"Your account has already been verified previously","emailVerification":"Email Verification requiered","emailReset":"Password reset Successfully","emailWelcome":"Welcome to 101Errors","profileTitle":"Profile","adminTitle":"Administration Panel","welcome":"Welcome ","confTitle":"Fill in all the missing information in order to configure your profile and start using 101Errors","selectTimezone":"Select your Timezone","selectTimezoneSpan":"Please select your Timezone","selectLanguage":"Select your Language","selectLanguageSpan":"Please select your Language","continue":"Continue","timezoneForm":"Please enter a valid Timezone","languageForm":"Please enter a valid Language","help":"\u00bfNeed Help?","profile":"My profile","home":"Home","headTitleProfile":"My profile","headTitleProfile2":"Modify your profile characteristics","changePicture":"Change your photo","changePicture2":"of profile","examinar":"Examine&hellip;","nameProfile":"Name","emailProfile":"Email","zonaHorarioProfile":"Time zone","idiomaProfile":"Language","contrase\u00f1aActualProfile":"Current password","olvidasteProfile":"Did you forget your password?","nuevaContrase\u00f1aProfile":"New Password","confirmarProfile":"Confirm Password","saveChangesProfile":"Save changes","successTrue":"TRUE","successFalse":"FALSE","admin":"ADMIN","BDsuccess":"The information was updated successfully","errorsBD":"There was an error, please contact your administrator","errorsBDRepeat":"This data already exists","errorFormat":"The file that you want to upload has a not valid format."},"en.pagination":{"previous":"&laquo; Previous","next":"Next &raquo;"},"en.passwords":{"password":"Passwords must be at least six characters and match the confirmation.","reset":"Your password has been reset!","sent":"We have e-mailed your password reset link!","token":"This password reset token is invalid.","user":"We can't find a user with that e-mail address."},"en.validation":{"accepted":"The :attribute must be accepted.","active_url":"The :attribute is not a valid URL.","after":"The :attribute must be a date after :date.","alpha":"The :attribute may only contain letters.","alpha_dash":"The :attribute may only contain letters, numbers, and dashes.","alpha_num":"The :attribute may only contain letters and numbers.","array":"The :attribute must be an array.","before":"The :attribute must be a date before :date.","between":{"numeric":"The :attribute must be between :min and :max.","file":"The :attribute must be between :min and :max kilobytes.","string":"The :attribute must be between :min and :max characters.","array":"The :attribute must have between :min and :max items."},"boolean":"The :attribute field must be true or false.","confirmed":"The :attribute confirmation does not match.","date":"The :attribute is not a valid date.","date_format":"The :attribute does not match the format :format.","different":"The :attribute and :other must be different.","digits":"The :attribute must be :digits digits.","digits_between":"The :attribute must be between :min and :max digits.","dimensions":"The :attribute has invalid image dimensions.","distinct":"The :attribute field has a duplicate value.","email":"The :attribute must be a valid email address.","exists":"The selected :attribute is invalid.","file":"The :attribute must be a file.","filled":"The :attribute field is required.","image":"The :attribute must be an image.","in":"The selected :attribute is invalid.","in_array":"The :attribute field does not exist in :other.","integer":"The :attribute must be an integer.","ip":"The :attribute must be a valid IP address.","json":"The :attribute must be a valid JSON string.","max":{"numeric":"The :attribute may not be greater than :max.","file":"The :attribute may not be greater than :max kilobytes.","string":"The :attribute may not be greater than :max characters.","array":"The :attribute may not have more than :max items."},"mimes":"The :attribute must be a file of type: :values.","mimetypes":"The :attribute must be a file of type: :values.","min":{"numeric":"The :attribute must be at least :min.","file":"The :attribute must be at least :min kilobytes.","string":"The :attribute must be at least :min characters.","array":"The :attribute must have at least :min items."},"not_in":"The selected :attribute is invalid.","numeric":"The :attribute must be a number.","present":"The :attribute field must be present.","regex":"The :attribute format is invalid.","required":"The :attribute field is required.","required_if":"The :attribute field is required when :other is :value.","required_unless":"The :attribute field is required unless :other is in :values.","required_with":"The :attribute field is required when :values is present.","required_with_all":"The :attribute field is required when :values is present.","required_without":"The :attribute field is required when :values is not present.","required_without_all":"The :attribute field is required when none of :values are present.","same":"The :attribute and :other must match.","size":{"numeric":"The :attribute must be :size.","file":"The :attribute must be :size kilobytes.","string":"The :attribute must be :size characters.","array":"The :attribute must contain :size items."},"string":"The :attribute must be a string.","timezone":"The :attribute must be a valid zone.","unique":"The :attribute has already been taken.","uploaded":"The :attribute failed to upload.","url":"The :attribute format is invalid.","custom":{"attribute-name":{"rule-name":"custom-message"}},"attributes":[]},"es.messages":{"user":"Nombre de Usuario","login":"Ingresar","register":"Registrarse","userormail":"Usuario o Mail","password":"Contrase\u00f1a","confPassword":"Confirmar Password","logfacebook":"Ingresar con Facebook","signfacebook":"Iniciar con Facebook","permisosredes":"No te preocupes. Nosotros no publicamos nada sin tu permiso y no almacenamos contrase\u00f1as.","nameForm":"Por favor proporcione un nombre de usuario","passwordFormRequired":"Por favor proporcione una contrase\u00f1a","passwordFormMinLength":"La contras\u00f1a debe contener al menos 5 caracteres","mailForm":"Por favor proporcione una direcci\u00f3n de correo v\u00e1lida","ResetPassword":"Recuperar Contrase\u00f1a","ResetPasswordButton":"Enviar link de reseteo de password","RememberMe":"Recordar","Forgot":"Olvidaste tu contrase\u00f1a?","keyPass":134343,"Copyright":"Copyright \u00a9 2016 BFC. All Rights Reserved.","Subscribe":"Suscr\u00edbete","SubscribeTxt":"Suscr\u00edbete a nuestro bolet\u00edn para recibir las \u00faltimas noticias.","privacy":"Respetamos su privacidad de correo electr\u00f3nico.","subscribeSuccess":"Se ha enviado un correo electr\u00f3nico para confirmar su suscripci\u00f3n.","notVerified":"El n\u00famero de verificaci\u00f3n no existe","verified":"Tu cuenta ha sido verificada","wasVerified":"Tu cuenta ya ha sido verificada con anterioridad","emailVerification":"Se requiere verificaci\u00f3n de correo electr\u00f3nico","emailReset":"Nueva Contrase\u00f1a","emailWelcome":"Bienvenido a 101Errors","profileTitle":"Perfil","adminTitle":"Panel de Administraci\u00f3n","welcome":"Bienvenido ","confTitle":"Complete toda la informaci\u00f3n faltante, para poder configurar su perfil y empezar a utilizar 101Errors","selectTimezone":"Seleccione su zona horaria","selectTimezoneSpan":"Por favor seleccione su zona horaria","selectLanguage":"Seleccione su idioma","selectLanguageSpan":"Por favor seleccione su idioma","continue":"Continuar","timezoneForm":"Por favor proporcione una Zona Horaria","languageForm":"Por favor proporcione un Idioma","help":"\u00bfNecesitas ayuda?","profile":"Mi perfil","home":"Inicio","headTitleProfile":"Mi perfil","headTitleProfile2":"Modifica las caracter\u00edsticas de tu perfil","changePicture":"Cambia tu foto","changePicture2":"de perfil","examinar":"Examinar&hellip;","nameProfile":"Nombre","emailProfile":"Correo electr\u00f3nico","zonaHorarioProfile":"Zona Horaria","idiomaProfile":"Idioma","contrase\u00f1aActualProfile":"Contrase\u00f1a actual","olvidasteProfile":"\u00bfOlvidaste tu contrase\u00f1a?","nuevaContrase\u00f1aProfile":"Nueva contrase\u00f1a","confirmarProfile":"Confirmar contrase\u00f1a","saveChangesProfile":"Guardar cambios","successTrue":"TRUE","successFalse":"FALSE","admin":"ADMIN","BDsuccess":"La informaci\u00f3n se actualiz\u00f3 correctamente","errorsBD":"Hubo un error por favor contacte al administrador","errorsBDRepeat":"Estos datos ya existen","errorFormat":"El archivo que desea cargar tiene un formato no v\u00e1lido."}});
})();
