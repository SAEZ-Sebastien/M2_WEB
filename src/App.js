import React from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
    },
    fab: {
        margin: theme.spacing(1),
    },
});

class App extends React.Component {

    constructor(props) {
        super(props);
        //V2
        this.state = {
            restaurants: [],
            userInput: '',
            displayNumber: 5,
            currentPage: 0,
            querySearchByName:'',
            cRestaurants:null,
            elementCount:0,
            modifMod:false,
            insertMod:false,
            colMod:false,
            showDetails:false,
            showModif:false,
            showAdd: false,
            message:'',
            notActiveClass:'col-lg-12',
            activeClass: 'col-lg-8',
            restaurantSelected:null,
            modifRestaurant:{
                id:null,
                nom:null,
                cuisine:null
            },
            newRestaurant:{
                nom:null,
                cuisine:null
            }
        };
    }



    componentDidMount(){
        console.log("Composant avant premier affichage")
        //TODO FAIRE LE TECH
         this.getDataFromServer('http://localhost:8080/api/restaurants?page='+this.state.currentPage+'&pagesize='+this.state.displayNumber);
    }

    getDataFromServer(url) {
        console.log("--- GETTING DATA ---");
        if(this.state.querySearchByName !== ""){
            url += "&name="+this.state.querySearchByName;
        }

        axios.get(url)
            .then(res => {
                console.log(res);
                this.setState({
                    restaurants :res.data.data,
                    elementCount : res.data.count,
                    cRestaurants : Math.ceil(this.state.elementCount/this.state.displayNumber)
                });
            });
    }

    handleChange = name => event => {
        this.setState({
        [name]: event.target.value
        }, this.load);

    };


   handleChangePage = (event, newPage) => {
       console.log(newPage);
       this.setState({
           currentPage : newPage
       }, this.load);
    };

    load(){
        this.getDataFromServer('http://localhost:8080/api/restaurants?page='+this.state.currentPage+'&pagesize='+this.state.displayNumber);
    }

    handleClickOpen = (event, row) => {
        this.setState({
            showDetails : true,
            restaurantSelected : row
        });
    };

    handleClickAddDialog = (event) => {
        this.setState({
            showAdd : true
        });
    };

    modifierRestaurant(){
        console.log("MODIFICATION RESTAURANT");
        axios.put('http://localhost:8080/api/restaurants/'+this.state.modifRestaurant._id,
            {_id:this.state.modifRestaurant._id,
                nom:this.state.modifRestaurant.name,
                cuisine:this.state.modifRestaurant.cuisine})
            .then(res => {
                console.log('saved successfully')
                this.setState({
                    restaurantSelected : null,
                    modifRestaurant: null
                });

                this.getDataFromServer('http://localhost:8080/api/restaurants?page='+this.state.currentPage+'&pagesize='+this.state.displayNumber)

            });


    };

    deleteRestaurant(){
        console.log("DELETE RESTAURANT");
        axios.delete('http://localhost:8080/api/restaurants/'+this.state.restaurantSelected._id)
            .then(res => {
                console.log('dropped successfully');
                this.setState({
                    restaurantSelected : null,
                });
                this.getDataFromServer('http://localhost:8080/api/restaurants?page='+this.state.currentPage+'&pagesize='+this.state.displayNumber);
            });


    };

    ajouterRestaurant (){
        console.log("AJOUTER RESTAURANT");
        axios.post('http://localhost:8080/api/restaurants',
            {
            nom:this.state.newRestaurant.name,
            cuisine:this.state.newRestaurant.cuisine
            })
            .then(res => {
                console.log('added successfully');
                this.setState({
                    newRestaurant:{
                        nom:null,
                        cuisine:null
                    }
                });
                this.getDataFromServer('http://localhost:8080/api/restaurants?page='+this.state.currentPage+'&pagesize='+this.state.displayNumber);
            });
    };



    handleClose = () => {
        this.setState({
            showDetails : false,
            showModif : false,
            showAdd: false,
            restaurantSelected : null,
            modifRestaurant :null
        });
    };

    handleValiderModification = (event, row) => {
        this.setState({
            showModif : false,
        },this.modifierRestaurant);
    };

    handleClickUpdate = (event, row) => {
        console.log(row);
        this.setState({
            showModif : true,
            restaurantSelected : row,
            modifRestaurant : row,
        });
    };

    handleClickDelete= (event, row) => {
        console.log(row);
        this.setState({
            restaurantSelected : row
        },this.deleteRestaurant);
    };

    handleSearchBy  = event => {
        this.setState({
            querySearchByName : event.target.value,
        }, this.load);

    };

    handleChangeTextField = prop => event => {

        let oldRestau = this.state.modifRestaurant;

        oldRestau[prop] = event.target.value;
        oldRestau._id = this.state.restaurantSelected._id;

        console.log(oldRestau[prop]);
        this.setState({
            modifRestaurant : oldRestau,
        });

    };

    handleChangeAddRestaurant = prop => event => {
        let rest = this.state.newRestaurant;
        rest[prop] = event.target.value;

        this.setState({
            newRestaurant : rest,
        });

    };

    handleAjouter = () =>{
        console.log(this);
        this.setState({
            showAdd : false,
        },this.ajouterRestaurant);
    }


render(){

        const { classes } = this.props;
        const {modifRestaurant, showModif, showAdd} = this.state;
        let nbRestaurant = this.state.elementCount;
        let page = this.state.currentPage;
        let lignesParPage = this.state.displayNumber;
        let isOpen = this.state.showDetails|| this.state.showModif
        let restauDetails = {name : "", cuisine: ""};

        if(this.state.restaurantSelected != null){
            restauDetails = this.state.restaurantSelected;
        }
    return (
        <div className="App">
            <Dialog
                open={isOpen}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{restauDetails.name}</DialogTitle>
                <DialogContent>
                        {showModif === true?
                            <Box>
                            <TextField
                                id="standard-uncontrolled"
                                label="Nom"
                                defaultValue={restauDetails.name}
                                className={classes.textField}
                                margin="normal"
                                onChange={this.handleChangeTextField('name')}
                            />

                            < TextField
                            id="standard-uncontrolled"
                            label="Cuisine"
                            defaultValue={restauDetails.cuisine}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.handleChangeTextField('cuisine')}
                            />

                                < TextField
                                    disabled
                                    id="standard-uncontrolled"
                                    label="Id"
                                    defaultValue={restauDetails._id}
                                    className={classes.textField}
                                    margin="normal"
                                />
                            </Box>
    :

                            restauDetails.cuisine

                        }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Fermer
                    </Button>
                    {showModif === true ?
                        <Button onClick={this.handleValiderModification} color="primary">
                            Valider modification
                        </Button>
                        :
                        ""
                       }


                </DialogActions>
            </Dialog>

            <Dialog
                open={showAdd}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Ajouter un restaurant</DialogTitle>
                <DialogContent>
                                <TextField
                                    required
                                    id="standard-required"
                                    label="Nom"
                                    className={classes.textField}
                                    margin="normal"
                                    onChange={this.handleChangeAddRestaurant('name')}
                                />

                                < TextField
                                    required
                                    id="standard-required"
                                    label="Cuisine"
                                    className={classes.textField}
                                    margin="normal"
                                    onChange={this.handleChangeAddRestaurant('cuisine')}
                                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Fermer
                    </Button>
                        <Button onClick={this.handleAjouter} color="primary">
                            Ajouter
                        </Button>
                </DialogActions>
            </Dialog>


            <TextField
                id="outlined-full-width"
                label="Search"
                style={{ margin: 8 }}
                placeholder="name"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleSearchBy}
            />
            <Paper>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nom du restaurant</TableCell>
                            <TableCell align="left">Cuisine</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.restaurants.map(row => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row" align="left">
                                    {row.name }
                                </TableCell>
                                <TableCell align="left">
                                    {row.cuisine}
                                </TableCell>
                                <TableCell align="right">

                                                    <Button variant="contained" className={classes.button} onClick={event => this.handleClickOpen(event, row)}>
                                                        Details
                                                    </Button>
                                                    <Button variant="contained" color="primary" className={classes.button} onClick={event => this.handleClickUpdate(event, row)}>
                                                        Modifier
                                                    </Button>

                                                    <IconButton aria-label="delete" className={classes.margin} onClick={event => this.handleClickDelete(event, row)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={nbRestaurant}
                    rowsPerPage={lignesParPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChange('displayNumber')}
                />
            </Paper>


            <Button color="primary" onClick={this.handleClickAddDialog}>
                Ajouter un restaurant
            </Button>
        </div>
    );
}
}


export default withStyles(useStyles)(App);
