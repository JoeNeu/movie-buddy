import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {MovieService} from "../../movies/movie.service";
import {HttpHeaders} from "@angular/common/http";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {takeUntil} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {AccountModel} from "../../models/account.model";

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject();
  commonHttpHeaders;
  public popularImages = [];
  public trendingImages = [];
  @ViewChild('tabGroup', {static: false}) tabGroup;
  private currentTab: number;

  loggedIn = false;
  currentUser;
  constructor(
    private movieService: MovieService,
    private store: Store
  ) {
    this.commonHttpHeaders = new HttpHeaders()
      .set('Access-Control-Allow-Methods', ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'])
      .set('Access-Control-Allow-Origin', '*');
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
  }

  ngOnInit(): void {
    this.store.select(getCurrentUser).pipe(takeUntil(this.unsubscribe$)).subscribe((user: AccountModel) => {
      if(user) {
        this.loggedIn = true;
        this.currentUser = user;
      }
    })

    // Test Data
    // const trendingData = {"page":1,"results":[{"id":438631,"adult":false,"backdrop_path":"/eeijXm3553xvuFbkPFkDG6CLCbQ.jpg","genre_ids":[28,12,878],"original_language":"en","original_title":"Dune","poster_path":"/d5NXSklXo0qyIYkgV94XAgMIckC.jpg","title":"Dune","video":false,"vote_average":8.0,"overview":"Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity's greatest potential-only those who can conquer their fear will survive.","release_date":"2021-09-15","vote_count":3312,"popularity":3726.282,"media_type":"movie"},{"id":796499,"adult":false,"backdrop_path":"/lxLiKYM4laorYKMxyaWrSVbLIjr.jpg","genre_ids":[28,53,35],"original_language":"en","original_title":"Army of Thieves","poster_path":"/iPTZGFmPs7HsXHYxiuxGolihjOH.jpg","title":"Army of Thieves","video":false,"vote_average":6.8,"overview":"A mysterious woman recruits bank teller Ludwig Dieter to lead a group of aspiring thieves on a top-secret heist during the early stages of the zombie apocalypse.","release_date":"2021-10-29","vote_count":377,"popularity":689.059,"media_type":"movie"},{"id":580489,"adult":false,"backdrop_path":"/lNyLSOKMMeUPr1RsL4KcRuIXwHt.jpg","genre_ids":[878,28],"original_language":"en","original_title":"Venom: Let There Be Carnage","poster_path":"/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg","vote_count":1504,"video":false,"vote_average":6.9,"title":"Venom: Let There Be Carnage","overview":"After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.","release_date":"2021-09-30","popularity":5004.938,"media_type":"movie"},{"adult":false,"backdrop_path":"/oE6bhqqVFyIECtBzqIuvh6JdaB5.jpg","genre_ids":[878,18,12],"id":522402,"original_language":"en","original_title":"Finch","overview":"On a post-apocalyptic Earth, a robot, built to protect the life of his dying creator's beloved dog, learns about life, love, friendship, and what it means to be human.","poster_path":"/jKuDyqx7jrjiR9cDzB5pxzhJAdv.jpg","release_date":"2021-11-04","title":"Finch","video":false,"vote_average":7.3,"vote_count":4,"popularity":102.242,"media_type":"movie"},{"genre_ids":[10749,18],"original_language":"en","original_title":"After We Fell","poster_path":"/3WfvjNWr5k1Zzww81b3GWc8KQhb.jpg","video":false,"vote_average":7.4,"overview":"Just as Tessa's life begins to become unglued, nothing is what she thought it would be. Not her friends nor her family. The only person that she should be able to rely on is Hardin, who is furious when he discovers the massive secret that she's been keeping. Before Tessa makes the biggest decision of her life, everything changes because of revelations about her family.","release_date":"2021-09-01","vote_count":679,"title":"After We Fell","adult":false,"backdrop_path":"/4vCh8R4yd6ybOmbxRAPOzaXmLTV.jpg","id":744275,"popularity":823.387,"media_type":"movie"},{"release_date":"2021-10-14","title":"Halloween Kills","adult":false,"backdrop_path":"/tDYwYktjFmpj92S2Qn4T3BcRgL.jpg","genre_ids":[27,53],"original_language":"en","original_title":"Halloween Kills","poster_path":"/qmJGd5IfURq8iPQ9KF3les47vFS.jpg","vote_count":1051,"video":false,"vote_average":7.1,"id":610253,"overview":"Minutes after Laurie Strode, her daughter Karen and granddaughter Allyson left masked monster Michael Myers caged and burning in Laurie's basement, Laurie is rushed to the hospital with life-threatening injuries, believing she finally killed her lifelong tormentor. But when Michael manages to free himself from Laurie's trap, his ritual bloodbath resumes. As Laurie fights her pain and prepares to defend herself against him, she inspires all of Haddonfield to rise up against their unstoppable monster. The Strode women join a group of other survivors of Michael's first rampage who decide to take matters into their own hands, forming a vigilante mob that sets out to hunt Michael down, once and for all.","popularity":1447.372,"media_type":"movie"},{"adult":false,"backdrop_path":"/3G6wET9eLvYn3aoIj8NfQFhpYEB.jpg","genre_ids":[28,12,878],"id":524434,"original_language":"en","original_title":"Eternals","overview":"The Eternals are a team of ancient aliens who have been living on Earth in secret for thousands of years. When an unexpected tragedy forces them out of the shadows, they are forced to reunite against mankind’s most ancient enemy, the Deviants.","poster_path":"/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg","release_date":"2021-11-03","title":"Eternals","video":false,"vote_average":7.4,"vote_count":152,"popularity":1447.407,"media_type":"movie"},{"adult":false,"backdrop_path":"/d0mpUFKzoPwF1KsdjHpkkaYSvKm.jpg","genre_ids":[37],"id":618162,"original_language":"en","original_title":"The Harder They Fall","overview":"Gunning for revenge, outlaw Nat Love saddles up with his gang to take down enemy Rufus Buck, a ruthless crime boss who just got sprung from prison.","poster_path":"/su9WzL7lwUZPhjH6eZByAYFx2US.jpg","release_date":"2021-10-22","title":"The Harder They Fall","video":false,"vote_average":6.3,"vote_count":57,"popularity":49.132,"media_type":"movie"},{"adult":false,"backdrop_path":"/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg","genre_ids":[35,28,12,878],"original_language":"en","original_title":"Free Guy","poster_path":"/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg","video":false,"vote_average":7.8,"vote_count":3359,"overview":"A bank teller called Guy realizes he is a background character in an open world video game called Free City that will soon go offline.","release_date":"2021-08-11","title":"Free Guy","id":550988,"popularity":1962.294,"media_type":"movie"},{"id":631843,"adult":false,"backdrop_path":"/iTgM25ftE7YtFgZwUZupVp8A61S.jpg","genre_ids":[53,9648,27],"vote_count":1539,"original_language":"en","original_title":"Old","poster_path":"/vclShucpUmPhdAOmKgf3B3Z4POD.jpg","title":"Old","video":false,"vote_average":6.7,"release_date":"2021-07-21","overview":"A group of families on a tropical holiday discover that the secluded beach where they are staying is somehow causing them to age rapidly – reducing their entire lives into a single day.","popularity":452.134,"media_type":"movie"},{"original_title":"F9","poster_path":"/bOFaAXmWWXC3Rbv4u4uM9ZSzRXP.jpg","title":"F9","vote_average":7.4,"overview":"Dominic Toretto and his crew battle the most skilled assassin and high-performance driver they've ever encountered: his forsaken brother.","release_date":"2021-05-19","vote_count":4263,"adult":false,"backdrop_path":"/fWjcUTKOKsAPK4VUAzEQW4kN4K6.jpg","video":false,"genre_ids":[28,80,53],"id":385128,"original_language":"en","popularity":739.179,"media_type":"movie"},{"id":436969,"adult":false,"backdrop_path":"/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg","genre_ids":[28,12,14],"vote_count":4631,"original_language":"en","original_title":"The Suicide Squad","poster_path":"/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg","title":"The Suicide Squad","video":false,"vote_average":7.8,"release_date":"2021-07-28","overview":"Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of nutty cons at Belle Reve prison join the super-secret, super-shady Task Force X as they are dropped off at the remote, enemy-infused island of Corto Maltese.","popularity":817.341,"media_type":"movie"},{"overview":"A young woman seeking self-improvement enlists the help of a renowned hypnotist but, after a handful of intense sessions, discovers unexpected and deadly consequences.","release_date":"2021-10-27","adult":false,"backdrop_path":"/9CyFLGfeDOrOOPouHp446T5MSNi.jpg","genre_ids":[53,18,27],"vote_count":177,"original_language":"en","id":864873,"poster_path":"/miEj4kNc4efZ5WbPJqWl1UXWrvS.jpg","title":"Hypnotic","video":false,"vote_average":6.1,"original_title":"Hypnotic","popularity":644.92,"media_type":"movie"},{"overview":"Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help. The mission to rescue a kidnapped scientist turns out to be far more treacherous than expected, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.","release_date":"2021-09-29","adult":false,"backdrop_path":"/u5Fp9GBy9W8fqkuGfLBuuoJf57Z.jpg","id":370172,"genre_ids":[12,28,53],"vote_count":1106,"original_language":"en","original_title":"No Time to Die","poster_path":"/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg","title":"No Time to Die","video":false,"vote_average":7.4,"popularity":402.291,"media_type":"movie"},{"original_language":"en","original_title":"Venom","poster_path":"/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg","title":"Venom","video":false,"vote_average":6.8,"overview":"Investigative journalist Eddie Brock attempts a comeback following a scandal, but accidentally becomes the host of Venom, a violent, super powerful alien symbiote. Soon, he must rely on his newfound powers to protect the world from a shadowy organization looking for a symbiote of their own.","release_date":"2018-09-28","vote_count":12076,"adult":false,"backdrop_path":"/VuukZLgaCrho2Ar8Scl9HtV3yD.jpg","id":335983,"genre_ids":[878,28],"popularity":1227.108,"media_type":"movie"},{"vote_average":6.8,"overview":"A college student moonlighting as a chauffeur picks up two mysterious women for a night of party-hopping across LA. But when he uncovers their bloodthirsty intentions - and their dangerous, shadowy underworld - he must fight to stay alive.","release_date":"2021-10-20","adult":false,"backdrop_path":"/mzulkJNDNasq6KyoNm03uaJVZSL.jpg","vote_count":265,"genre_ids":[27,53,28],"video":false,"original_language":"en","original_title":"Night Teeth","poster_path":"/4niEFGAUEz3GUqwk9Y2y4aAERhE.jpg","title":"Night Teeth","id":669671,"popularity":469.613,"media_type":"movie"},{"adult":false,"backdrop_path":"/pVAWkob7vrviUJ0RIextyl5tGXF.jpg","genre_ids":[27,9648,53],"id":609972,"original_language":"en","original_title":"Paranormal Activity: Next of Kin","overview":"Margot, a documentary filmmaker, heads to a secluded Amish community in the hopes of learning about her long-lost mother and extended family. Following a string of strange occurrences and discoveries, she comes to realize this community may not be what it seems.","poster_path":"/VWLIJBn5UdSV0osmnF7JAwfWSE.jpg","release_date":"2021-10-29","title":"Paranormal Activity: Next of Kin","video":false,"vote_average":6.7,"vote_count":73,"popularity":100.684,"media_type":"movie"},{"adult":false,"backdrop_path":"/keIxh0wPr2Ymj0Btjh4gW7JJ89e.jpg","genre_ids":[28,12,878],"vote_count":5756,"original_language":"en","original_title":"Black Widow","poster_path":"/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg","release_date":"2021-07-07","video":false,"vote_average":7.7,"title":"Black Widow","overview":"Natasha Romanoff, also known as Black Widow, confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises. Pursued by a force that will stop at nothing to bring her down, Natasha must deal with her history as a spy and the broken relationships left in her wake long before she became an Avenger.","id":497698,"popularity":632.375,"media_type":"movie"},{"original_language":"en","original_title":"Apex","poster_path":"/cobRV6hAj8h7dRU4WZ3dkGaRQv2.jpg","id":763164,"title":"Apex","vote_average":0.0,"overview":"Ex-cop James Malone is serving a life sentence for a crime he didn’t commit. He is offered a chance at freedom if he can survive a deadly game of Apex, in which six hunters pay for the pleasure of hunting another human on a remote island. He accepts, and once he arrives, all hell breaks loose.","release_date":"2021-11-12","vote_count":0,"adult":false,"backdrop_path":"/oGC6etRRnMQaLAorTESurrHquB.jpg","video":false,"genre_ids":[28,53,878],"popularity":74.633,"media_type":"movie"},{"overview":"Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.","release_date":"2021-09-01","adult":false,"backdrop_path":"/nDLylQOoIazGyYuWhk21Yww5FCb.jpg","id":566525,"genre_ids":[28,12,14],"vote_count":1387,"original_language":"en","original_title":"Shang-Chi and the Legend of the Ten Rings","poster_path":"/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg","title":"Shang-Chi and the Legend of the Ten Rings","video":false,"vote_average":7.7,"popularity":994.424,"media_type":"movie"}],"total_pages":1000,"total_results":20000}
    // this.trendingImages = trendingData.results.map(obj => {
    //   return {
    //     ...obj,
    //     path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
    //   }
    // })

    this.movieService.getTrendingMovies().pipe(
     takeUntil(this.unsubscribe$)
    ).subscribe(data => {
          this.trendingImages = data.results.map(obj => {
            return {
              ...obj,
              path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
            }
          })
        }
      )
    // const popularData = {"page":1,"results":[{"adult":false,"backdrop_path":"/lNyLSOKMMeUPr1RsL4KcRuIXwHt.jpg","genre_ids":[878,28],"id":580489,"original_language":"en","original_title":"Venom: Let There Be Carnage","overview":"After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.","popularity":5004.938,"poster_path":"/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg","release_date":"2021-09-30","title":"Venom: Let There Be Carnage","video":false,"vote_average":6.9,"vote_count":1504},{"adult":false,"backdrop_path":"/eeijXm3553xvuFbkPFkDG6CLCbQ.jpg","genre_ids":[28,12,878],"id":438631,"original_language":"en","original_title":"Dune","overview":"Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity's greatest potential-only those who can conquer their fear will survive.","popularity":3726.282,"poster_path":"/d5NXSklXo0qyIYkgV94XAgMIckC.jpg","release_date":"2021-09-15","title":"Dune","video":false,"vote_average":8,"vote_count":3312},{"adult":false,"backdrop_path":"/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg","genre_ids":[35,28,12,878],"id":550988,"original_language":"en","original_title":"Free Guy","overview":"A bank teller called Guy realizes he is a background character in an open world video game called Free City that will soon go offline.","popularity":1962.294,"poster_path":"/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg","release_date":"2021-08-11","title":"Free Guy","video":false,"vote_average":7.8,"vote_count":3359},{"adult":false,"backdrop_path":"/hugKriLPeBm3lErSCQiFOgQzpkC.jpg","genre_ids":[28,53,80],"id":574060,"original_language":"en","original_title":"Gunpowder Milkshake","overview":"In her turbulent life as a professional assassin, Sam has no choice but to go rogue to save the life of an innocent 8-year-old girl in the middle of the gang war she has unleashed.","popularity":1597.243,"poster_path":"/5AaKulwpUtkscAokKWtLenGTfVS.jpg","release_date":"2021-07-14","title":"Gunpowder Milkshake","video":false,"vote_average":6.5,"vote_count":326},{"adult":false,"backdrop_path":"/3G6wET9eLvYn3aoIj8NfQFhpYEB.jpg","genre_ids":[28,12,878],"id":524434,"original_language":"en","original_title":"Eternals","overview":"The Eternals are a team of ancient aliens who have been living on Earth in secret for thousands of years. When an unexpected tragedy forces them out of the shadows, they are forced to reunite against mankind’s most ancient enemy, the Deviants.","popularity":1447.407,"poster_path":"/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg","release_date":"2021-11-03","title":"Eternals","video":false,"vote_average":7.4,"vote_count":152},{"adult":false,"backdrop_path":"/tDYwYktjFmpj92S2Qn4T3BcRgL.jpg","genre_ids":[27,53],"id":610253,"original_language":"en","original_title":"Halloween Kills","overview":"Minutes after Laurie Strode, her daughter Karen and granddaughter Allyson left masked monster Michael Myers caged and burning in Laurie's basement, Laurie is rushed to the hospital with life-threatening injuries, believing she finally killed her lifelong tormentor. But when Michael manages to free himself from Laurie's trap, his ritual bloodbath resumes. As Laurie fights her pain and prepares to defend herself against him, she inspires all of Haddonfield to rise up against their unstoppable monster. The Strode women join a group of other survivors of Michael's first rampage who decide to take matters into their own hands, forming a vigilante mob that sets out to hunt Michael down, once and for all.","popularity":1447.372,"poster_path":"/qmJGd5IfURq8iPQ9KF3les47vFS.jpg","release_date":"2021-10-14","title":"Halloween Kills","video":false,"vote_average":7.1,"vote_count":1051},{"adult":false,"backdrop_path":"/2OFg5p9yarI5zZsUWKCRgBgPctj.jpg","genre_ids":[28,12],"id":568620,"original_language":"en","original_title":"Snake Eyes: G.I. Joe Origins","overview":"After saving the life of their heir apparent, tenacious loner Snake Eyes is welcomed into an ancient Japanese clan called the Arashikage where he is taught the ways of the ninja warrior. But, when secrets from his past are revealed, Snake Eyes' honor and allegiance will be tested – even if that means losing the trust of those closest to him.","popularity":1368.113,"poster_path":"/uIXF0sQGXOxQhbaEaKOi2VYlIL0.jpg","release_date":"2021-07-22","title":"Snake Eyes: G.I. Joe Origins","video":false,"vote_average":6.9,"vote_count":768},{"adult":false,"backdrop_path":"/eBGKU0ZLJmxtVtzESTB1mfllX1J.jpg","genre_ids":[80,28,53],"id":630004,"original_language":"en","original_title":"The Vault","overview":"When an engineer learns of a mysterious, impenetrable fortress hidden under The Bank of Spain, he joins a crew of master thieves who plan to steal the legendary lost treasure locked inside while the whole country is distracted by Spain's World Cup Final. With thousands of soccer fans cheering in the streets, and security forces closing in, the crew have just minutes to pull off the score of a lifetime.","popularity":1286.224,"poster_path":"/kWhXubAiIcHW0xn5GThflqaKZqh.jpg","release_date":"2021-03-03","title":"The Vault","video":false,"vote_average":7,"vote_count":378},{"adult":false,"backdrop_path":"/4O40vu2KOgnFfxvrZgzBG6havQ.jpg","genre_ids":[28,80,53],"id":645788,"original_language":"en","original_title":"The Protégé","overview":"Rescued as a child by the legendary assassin Moody and trained in the family business, Anna is the world’s most skilled contract killer. When Moody, the man who was like a father to her and taught her everything she needs to know about trust and survival, is brutally killed, Anna vows revenge. As she becomes entangled with an enigmatic killer whose attraction to her goes way beyond cat and mouse, their confrontation turns deadly and the loose ends of a life spent killing will weave themselves ever tighter.","popularity":1270.418,"poster_path":"/o9FY8N5c8CXf22q8s4CmRRjAQJx.jpg","release_date":"2021-08-19","title":"The Protégé","video":false,"vote_average":6.8,"vote_count":315},{"adult":false,"backdrop_path":"/wfrfxivLOBtGMC98tIr2LSOeKSe.jpg","genre_ids":[16,35,10751],"id":639721,"original_language":"en","original_title":"The Addams Family 2","overview":"The Addams get tangled up in more wacky adventures and find themselves involved in hilarious run-ins with all sorts of unsuspecting characters.","popularity":1234.875,"poster_path":"/ld7YB9vBRp1GM1DT3KmFWSmtBPB.jpg","release_date":"2021-10-01","title":"The Addams Family 2","video":false,"vote_average":7.5,"vote_count":509},{"adult":false,"backdrop_path":"/VuukZLgaCrho2Ar8Scl9HtV3yD.jpg","genre_ids":[878,28],"id":335983,"original_language":"en","original_title":"Venom","overview":"Investigative journalist Eddie Brock attempts a comeback following a scandal, but accidentally becomes the host of Venom, a violent, super powerful alien symbiote. Soon, he must rely on his newfound powers to protect the world from a shadowy organization looking for a symbiote of their own.","popularity":1227.108,"poster_path":"/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg","release_date":"2018-09-28","title":"Venom","video":false,"vote_average":6.8,"vote_count":12076},{"adult":false,"backdrop_path":"/6xCOWFIb1Za7jeP6rqw7SfPgkNX.jpg","genre_ids":[28,53],"id":768449,"original_language":"en","original_title":"American Badger","overview":"A seemingly cold-blooded hitman is assigned to befriend a call girl, but all hell breaks loose when he is assigned to kill her.","popularity":1187.33,"poster_path":"/8mO2ZTTOnLnaEQd1sNZAE2XBoOg.jpg","release_date":"2021-03-05","title":"American Badger","video":false,"vote_average":6.5,"vote_count":12},{"adult":false,"backdrop_path":"/sjeEHzxdDrtMTHQwARi4UJ4NXN7.jpg","genre_ids":[878,53,9648],"id":675319,"original_language":"en","original_title":"Zone 414","overview":"In the near future on a colony of state-of-the-art robots, a private investigator is hired by the colony's creator to bring his missing daughter home.","popularity":1100.891,"poster_path":"/wIm5S6Blkb0qDMTGVu80VWSrQV1.jpg","release_date":"2021-09-03","title":"Zone 414","video":false,"vote_average":5.9,"vote_count":80},{"adult":false,"backdrop_path":"/1yJ8wBmWyEM24UFUSDaRHJFMPPL.jpg","genre_ids":[28,35,53,27],"id":760747,"original_language":"no","original_title":"I onde dager","overview":"A dysfunctional couple head to a remote lakeside cabin under the guise of reconnecting, but each has secret designs to kill the other. Before they can carry out their respective plans, unexpected visitors arrive and the couple is faced with a greater danger than anything they could have plotted.","popularity":1097.953,"poster_path":"/uXGoV9IgKChvN7UGMj01y3purGc.jpg","release_date":"2021-07-30","title":"The Trip","video":false,"vote_average":7,"vote_count":96},{"adult":false,"backdrop_path":"/7h5WAPAcUzOWpp2jrwHBB48790j.jpg","genre_ids":[16,28],"id":843241,"original_language":"ja","original_title":"劇場版 七つの大罪 光に呪われし者たち","overview":"With the help of the \"Dragon Sin of Wrath\" Meliodas and the worst rebels in history, the Seven Deadly Sins, the \"Holy War\", in which four races, including Humans, Goddesses, Fairies and Giants fought against the Demons, is finally over. At the cost of the \"Lion Sin of Pride\" Escanor's life, the Demon King was defeated and the world regained peace. After that, each of the Sins take their own path.","popularity":1080.224,"poster_path":"/k0ThmZQl5nHe4JefC2bXjqtgYp0.jpg","release_date":"2021-07-02","title":"The Seven Deadly Sins: Cursed by Light","video":false,"vote_average":8.4,"vote_count":205},{"adult":false,"backdrop_path":"/nDLylQOoIazGyYuWhk21Yww5FCb.jpg","genre_ids":[28,12,14],"id":566525,"original_language":"en","original_title":"Shang-Chi and the Legend of the Ten Rings","overview":"Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.","popularity":994.424,"poster_path":"/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg","release_date":"2021-09-01","title":"Shang-Chi and the Legend of the Ten Rings","video":false,"vote_average":7.7,"vote_count":1387},{"adult":false,"backdrop_path":"/askg3SMvhqEl4OL52YuvdtY40Yb.jpg","genre_ids":[10751,16,14,10402,35,12],"id":354912,"original_language":"en","original_title":"Coco","overview":"Despite his family’s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead following a mysterious chain of events. Along the way, he meets charming trickster Hector, and together, they set off on an extraordinary journey to unlock the real story behind Miguel's family history.","popularity":967.67,"poster_path":"/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg","release_date":"2017-10-27","title":"Coco","video":false,"vote_average":8.2,"vote_count":14715},{"adult":false,"backdrop_path":"/dIibeeq4QMay5bTJ2vjr72IFFRo.jpg","genre_ids":[14,12,35],"id":589754,"original_language":"ru","original_title":"Последний богатырь: Корень зла","overview":"Peace and tranquility have set in Belogorie. The evil was defeated and Ivan is now enjoying his well-deserved fame. He is surrounded by his family, friends and small wonders from the modern world that help him lead a comfortable life. Luckily, he has his Magic Sword to cut a gap between the worlds to get some supplies quite regularly. But when an ancient evil rises and the existence of the magic world is put to danger, Ivan has to team up with his old friends and his new rivals. They will set out on a long journey beyond the known world to find a way to defeat the enemies and to return peace to Belogorie.","popularity":911.522,"poster_path":"/5VJSIAhSn4qUsg5nOj4MhQhF5wQ.jpg","release_date":"2021-01-01","title":"The Last Warrior: Root of Evil","video":false,"vote_average":7.1,"vote_count":62},{"adult":false,"backdrop_path":"/5UmoOvOmnCHiJj3TAKVn7uNAKAW.jpg","genre_ids":[28,35,12],"id":772436,"original_language":"es","original_title":"Matando Cabos 2: La Máscara del Máscara","overview":"Faced with the unexpected death of his estranged father -El Máscara- and the subsequent theft of his precious mask, Rubén -Mascarita- will find himself confronted with his past. Alongside his invincible bodyguard Tony \"The Cannibal\" and, an unexpected ally, he will have only one day to recover it and make amends with the memory of his father.","popularity":854.693,"poster_path":"/jxdKa1467pktAILLbfw6kZyQlbW.jpg","release_date":"2021-10-01","title":"Matando Cabos 2: La Máscara del Máscara","video":false,"vote_average":8,"vote_count":53},{"adult":false,"backdrop_path":"/owraiceOKtSOa3t8sp3wA9K2Ox6.jpg","genre_ids":[16,28,12,878],"id":703771,"original_language":"en","original_title":"Deathstroke: Knights & Dragons - The Movie","overview":"The assassin Deathstroke tries to save his family from the wrath of H.I.V.E. and the murderous Jackal.","popularity":845.823,"poster_path":"/vFIHbiy55smzi50RmF8LQjmpGcx.jpg","release_date":"2020-08-04","title":"Deathstroke: Knights & Dragons - The Movie","video":false,"vote_average":6.9,"vote_count":291}],"total_pages":500,"total_results":10000}
    // this.popularImages = popularData.results.map(obj => {
    //   return {
    //     ...obj,
    //     path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
    //   }
    // })
    this.movieService.getPopularMovies().pipe(
         takeUntil(this.unsubscribe$)
        ).subscribe(data => {
          this.popularImages = data.results.filter(obj => obj.poster_path).map(obj => {
            return {
              ...obj,
              path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + obj.poster_path
            }
          })
        }
      )
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
