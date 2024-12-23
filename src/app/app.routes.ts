import { Routes } from '@angular/router';

import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MyaccountComponent } from './components/myaccount/myaccount.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';
import { ProductComponent } from './components/product/product.component';
import { MyofferComponent } from './components/myoffer/myoffer.component';
import { MymessageComponent } from './components/mymessage/mymessage.component';
import { ProducteditComponent } from './components/myaccount/productedit/productedit.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'search', component: SearchComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'myaccount', component: MyaccountComponent},
    {path: 'myaccount/product/edit/:id', component: ProducteditComponent},
    {path: 'post', component: PostComponent},
    {path: 'product/:id', component: ProductComponent},
    {path: 'myoffer', component: MyofferComponent},
    {path: 'mymessage', component: MymessageComponent},
    {path: 'legal-notice', component: LegalNoticeComponent},
    {path: 'cookies', component: CookiesComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'contact', component: ContactComponent}
];
