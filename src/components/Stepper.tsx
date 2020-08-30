import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { quizActionCreators } from '../redux/quiz';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
});

export default connect(
  state => state, 
  dispatch => bindActionCreators(quizActionCreators, dispatch)
)((props: any) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleSubmit = props.handleSubmit || function() { console.warn('Please set up a submit function')};

  return (
    <MobileStepper
      variant='progress'
      steps={props.questions.length}
      position='static'
      activeStep={props.current_question}
      className={classes.root}
      nextButton={props.current_question === props.questions.length - 1 ?
        <Button size='small' onClick={handleSubmit}>
          Submit
        </Button>
      :
        <Button 
          size='small' 
          onClick={() => props.setCurrentQuestion(props.current_question + 1)} 
          disabled={props.current_question === props.questions.length - 1}
        >
          Next
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </Button>
      }
      backButton={
        <Button 
          size="small" 
          onClick={() => props.setCurrentQuestion(props.current_question - 1)} 
          disabled={props.current_question === 0}
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          Back
        </Button>
      }
    />
  );
});
