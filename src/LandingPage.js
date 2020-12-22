import React from "react";
import { FaPlus ,FaSpinner} from "react-icons/fa";
import Spinner from './postspinner';


class LandingPage extends React.Component {
    constructor(props){
        super(props);
    
        this.fetchPosts = this.fetchPosts.bind(this);
        this.state = {
            loading: true,
            users: [],
            post:[],
            showposticom:false,
            personposts:[],
            index:'',
            posttitle:'',
            personname:'',
            postdisplay:false,
            commentdispaly:false,
            loadingpostindex:0,
            specifiedPost:[],
            comment:[],
            loadbutton:false
          };
      }
   
  

      async componentDidMount() {
        const url = "https://jsonplaceholder.typicode.com/users";
        const response = await fetch(url);
        const data = await response.json();
        var index;
        for (let i = 0; i < data.length; i++) {
            if (data[i].name.includes('Mrs. ')) {
                data[i].name = data[i].name.replace(/Mrs. /gi, '');
            }
            index = data[i].name.indexOf(' ');
            data[i].name = data[i].name.substring(0, index)
    
        }
        this.setState({
            users: data,
            loading: false
        });
    
    }
    async fetchPosts(userID) {
        var firstname= this.state.users[userID-1].name;
        this.setState({
            showposticom:true
        })
        const url = "https://jsonplaceholder.typicode.com/posts";
        const response = await fetch(url);
        const posts = await response.json();
        this.setState({ post: posts, loading: false, index:userID });
        const userPost=[];
        for (let i = 0; i < posts.length; i++) {
            if(posts[i].userId == userID ){
                userPost.push(posts[i])
            }
        }
    
        this.setState({ specifiedPost: userPost, loadbutton:true,
             loadingpostindex:3, personname:firstname,
              postdisplay:true ,commentdispaly:false,
              showposticom:false},()=>{
        })
    }
    loadingindex(){
        this.setState({
            loadingpostindex:this.state.specifiedPost.length,
            loadbutton:false
        })
    }
    async fetchComments(id, title) {
        const url = "https://jsonplaceholder.typicode.com/comments";
        const response = await fetch(url);
        const comments = await response.json();
        this.setState({
            post: comments,
            loading: false,
            index: id
        });
        const postComments = [];
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].postId == id) {
                postComments.push(comments[i])
            }
        }
    
        this.setState({
            comment: postComments,
            commentdispaly: true,
            posttitle: title
        }, () => {
            console.log(this.state.comment)
        })
    }

  render() {
    let loadall;  
    let personName;
    let displaypostcomment;
    if(this.state.loadbutton){
        loadall=(   
        <div className="container">
            <br/>
            <div className="row justify-content-end">
                <div className="col-3">
                <button className="btn btn-info"  style={{borderRadius:"0px"}}  onClick={() => this.loadingindex()}>Load all</button>
                </div>
        </div>
        </div>
        )
    }
    if(this.state.commentdispaly){
        displaypostcomment=(
            <div class="container">
   <br/>
   <div class="card">
      <div class="card-header">
        Comments on <b>{this.state.personname}</b> <em>{this.state.posttitle}</em> post
      </div>
      <div class="card-body">
         <div class="row">
            <div class="col-md-12" id="primary">
                {this.state.comment.map(person => (
                <div key={person.id} style={{display: "inline"}}>
                <p >{person.name}</p>
                <p style={{borderBottom: "1px solid grey"}}>{person.body}</p>
            <br/>
        </div>
        ))}
            </div>
         </div>
      </div>
      
   </div>
</div>
        )
    }
    //Loading icon for users
    if (this.state.loading) {
      return <div style={{textAlign:"center", fontSize:"40px",}}>
          Loading <FaSpinner/> 
          </div>;
    }
    //Loading icon for posts
    if(this.state.showposticom){
        return <div><Spinner/></div>;
    }
    //Setting the person name on display post condition
    if(this.state.postdisplay){
        personName=(
           <div> Post from {this.state.personname}</div>
        )

    }
    return (
      <div>
        <div className="container">
        {/* Displaying all the users from server */}
        {this.state.users.map(user => (
          <div key={user.id} style={{display: "inline", marginRight:"2px"}}>
            <button className='btn btn-info' style={{borderRadius:"0px"}} onClick={() => this.fetchPosts(user.id)}>{user.name}</button>
          </div>
        ))}
         </div>
         
         {/* Display the specific person first name if the user select that user */}
        <div className="container">
            <br/>
            <h5>{personName}</h5>
        </div>

        {/* Display posts here of that specific user with 3 post initially*/}
        {this.state.specifiedPost.slice(0,this.state.loadingpostindex).map(post => (
            <div key={post.id} style={{display: "inline"}}>
            <br/> <br/>
        <div className='container'>
            <div className="row">
                <div className="col-md-10" style={{border: "solid grey 1px",  background:"#007bffbd"}}>
                    <p style={{textAlign:"center"}}>{post.title}</p>
                    <p>{post.body}</p>
                </div>
                <div className="col-md-2">
                <i className="fas fa-plus"></i>
                <p onClick={() => this.fetchComments(post.id,post.title)} style={{color:"#007bffbd",fontSize:"45px", cursor: "pointer"}}><FaPlus/></p>
                </div>
            </div>
        </div>
        </div>
        ))}
        
        {/* Display all of the posts here of that specific user if the load all button is clicked*/}
        {loadall}

        {/* Displaying post comments here*/}
        {displaypostcomment}
            
      </div>
      
    );
  }
}

export default LandingPage;