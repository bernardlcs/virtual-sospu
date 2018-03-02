import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Produto} from "../interfaces/produto";
import {HttpClient} from '@angular/common/http';
import{ Subscription} from "rxjs/Subscription";

import { Http, Response, Headers, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {LogginService} from "./loggin.service";
import {catchError} from "rxjs/operators";
import 'rxjs/add/operator/map';


@Injectable()
export class ProdutoService {


  planos : any;
  isAddProduto: boolean = false;
  headers = new Headers({'Content-Type': 'application/json','chave': localStorage.getItem('chave')});

  options = new RequestOptions({headers: this.headers});
  //eita = new Headers({'chave': localStorage.getItem('token')});

  erro:any;


  constructor(private router: Router , private http: HttpClient, private loggin: LogginService, private ptth: Http) {

  }

  getIsAddProduto(){
    return this.isAddProduto;
  }


  // metodo pra retornar os produtos
  getAllProdutos(): Observable<Array<Produto>>{
    //let other = this.headers.append('chave',localStorage.getItem('token'));
    //let chave = localStorage.getItem('token');

    console.log("antes de entrar no htttp   este é o header"+ this.options.headers.get('chave'));

    return this.ptth.get('produtos/listar', this.options)
      .map(response => {
        let result = response.status.valueOf();
        console.log("depois do htttp");
        console.log(result);
        if( result === 200){
          console.log(response.text());
          return response.json();
        }
      });

  }

  private extractObject(res: Response): Object {
    const data: any = res.json();
    return data || {};
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);

  }

  getDosProduto(): Observable<Produto[]>{
    console.log("aqui é o headers  "+this.headers.get('chave'));
    console.log("aqui é o header key"+ this.headers.keys().toString());
    return this.http.get("produtos/listar", this.headers.get('chave').toString())
      .map(this.extractData);
     // .catch(this.handleErrorObservable);
  }


  addProduto(nomeProduto,marcaProduto,corProduto,referenciaProduto,quantProduto,descricaoProduto){

    let  body = {nome: nomeProduto, marca: marcaProduto, referencia: referenciaProduto,cor: corProduto,
                  descricao: descricaoProduto, quantidade: quantProduto};
   console.log(body);
   this.isAddProduto = true;
   console.log("chave no addProduto  "+this.options.headers.get('chave'));

   this.ptth.post('/produtos', JSON.stringify(body),this.options.headers.get('chave')).map(res => res.valueOf()) }

  novoProduto(): void{
    this.isAddProduto = false;
  }























  deleteProduto(produtoId: string, quantidade: number): Observable<Produto>{

    return this.http.delete('/produtos' +'/' + produtoId+ '/' + quantidade).map( response => console.log(response))
      .catch(this.handleError);
  }

  atuliazarProduto(produto: Produto): Observable<Produto>{
    let  body = {nome: produto.nomeProduto, marca: produto.marcaProduto, cor: produto.corProduto,
      referencia: produto.referenciaProduto, quantidade: produto.quantProduto, descricao: produto.descricaoProduto};

    return this.http.put('api/produto'+ '/' + produto.id, body).map( sucess =>
     sucess.valueOf()).catch(this.handleError);
  }

  getProdutoID(produtoId: string): Observable<Produto>{
    return this.http.get('api/produto' + '/' + produtoId).map(response =>
    response.valueOf()).catch(this.handleError);

  }


  private handleError (error: Response | any) {
    console.log(error.message);
    return Observable.throw(error.status);
  }

  ngOnInit() {
  }




}
