import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { quizActionCreators } from './redux/quiz';
import Stepper from './components/Stepper';
import { 
  Box, Grid, Card, CardActions, CardContent, Typography, RadioGroup, 
  FormControlLabel, Radio, FormControl
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw'
  },
  cardActions: {
    '& .MuiMobileStepper-root': {
      maxWidth: 'inherit !important',
      background: 'none'
    }
  }
});


export default connect(
  state => state, 
  dispatch => bindActionCreators(quizActionCreators, dispatch)
)((props: any) => {

  const classes = useStyles();

  const [reset, setReset] = React.useState(true);

  useEffect(() => {
    if (reset) {
      fetch('https://opentdb.com/api.php?amount=10').then(res => res.json())
      .then(res => {
        let questions = res.results;
        for (let question of questions) {
          question.answers = question.incorrect_answers;
          question.answers.splice(Math.floor(Math.random() * Math.floor(question.incorrect_answers.length)), 0, question.correct_answer);
          question.user_answer = '';
        }
        props.setQuestions(questions);
        props.setCurrentQuestion(0);
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        setReset(false);
      });
    }
  }, [reset]);

  const [answer, setAnswer] = React.useState(props.questions.length > 0 ? props.questions[props.current_question].user_answer : '');

  useEffect(() => {
    const answer = props.questions.length > 0 ? props.questions[props.current_question].user_answer : '';
    setAnswer(answer);
  }, [props]);

  const handleAnswerSelect = (event: any) => {
    props.answerQuestion(event.target.value);
    setAnswer(event.target.value);
  }

  const handleSubmit = () => {
    let incorrect_answers = 0;
    for (const question of props.questions) {
      incorrect_answers = question.correct_answer !== question.user_answer ? incorrect_answers + 1 : incorrect_answers;
    }
    var alertText = `You scored a ${((props.questions.length - incorrect_answers) / props.questions.length) * 100}%`;
    for (const [i, question] of props.questions.entries()) {
      alertText = alertText + `\n${i + 1}.${question.question}\nYour Answer: ${question.user_answer}\nCorrect Answer: ${question.correct_answer}`;
    }
    alert(alertText);
    setReset(true);
  }

  return (
    <Box className={classes.box}>
      <Grid container justify='center' alignItems='center'>
        <Grid item xs={12} sm={10}>
          <Card>
            <CardContent>
              {props.questions.length > 0 &&
                <React.Fragment>
                  <Typography>
                    {
                      // <Question question={props.questions[props.current_question]}/>
                      props.questions[props.current_question].question
                    }
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup 
                      aria-label="answer choices" 
                      name="answerChoices" 
                      value={answer} 
                      onChange={handleAnswerSelect}
                      key={props.questions[props.current_question].user_answer}
                    >
                      {props.questions[props.current_question].answers.map((answer_choice: string) => 
                        <FormControlLabel 
                          value={answer_choice} 
                          control={<Radio key={`Radio_${answer_choice}`}/>} 
                          label={answer_choice} 
                          aria-label={answer_choice}
                          key={`FormControlLabel_${answer_choice}`}
                        />
                      )}
                    </RadioGroup>
                  </FormControl>
                </React.Fragment>
              }
            </CardContent>
            <CardActions className={classes.cardActions} style={{justifyContent: 'center'}}>
              <Stepper handleSubmit={handleSubmit} />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

const Question = (props: { question: any; }): any => {
  const question: any = props.question;
  var txt: any = document.createElement("textarea");
  txt.innerHTML = question.question;
  return(React.cloneElement(txt.value));
}