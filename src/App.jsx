import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, InputGroup, Modal, ModalBody, Row, Spinner} from 'react-bootstrap';
import CostNode from './CostNode';


//Fetch Method for post Request
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

//Name of States with Abbreviations
const stateNames = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New_Hampshire',
    'NJ': 'New_Jersey',
    'NM': 'New_Mexico',
    'NY': 'New_York',
    'NC': 'North_Carolina',
    'ND': 'North_Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode_Island',
    'SC': 'South_Carolina',
    'SD': 'South_Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West_Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
};

const App = () => {

    //Default State Values
    const [results, setResults] = useState({
        taxes: [
            {
                taxType: 'Federal Tax',
                taxValue: '4,342.00'
            }, {
                taxType: 'State Tax',
                taxValue: '2,321.26'
            }, {
                taxType: 'Social Security Tax',
                taxValue: '3,100.00'
            }, {
                taxType: 'Medicare Tax',
                taxValue: '725.00'
            },
        ],
        average_rent: {
            month: '12/2019',
            allBeds: '3,417',
            oneBed: '2,860',
            twoBeds: '3,675',
        }
    });
    const [city, setCity] = useState('New York');
    const [salary, setSalary] = useState('50000');
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState('New_York');
    const [cityValue, setCityValue] = useState('new-york');
    const [modalMessage, setModalMessage] = useState('Fetching Data From API');
    const [totalCostsList, setTotalCostsList] = useState([
        {
            costID: 0,
            costType: 'Utilities',
            amount: 100,
        },
        {
            costID: 1,
            costType: 'Groceries',
            amount: 100,
        },
        {
            costID: 2,
            costType: 'Public Transport',
            amount: 100,
        },
    ]);
    const [switchAllBed, setSwitchAllBed] = useState(false);
    const [switchOneBed, setSwitchOneBed] = useState(false);
    const [switchTwoBed, setSwitchTwoBed] = useState(false);
    const [switchCustomRent, setSwitchCustomRent] = useState(false);
    const [customRent, setCustomRent] = useState(0);
    const [showTutorial, setShowTutorial] = useState(true);

    //Toogles/Untoggles other switches when one of the switch is toggled
    const toggleRentSwitch = (id) => {
        if (id === 0) {
            setSwitchAllBed(!switchAllBed);
            setSwitchOneBed(false);
            setSwitchTwoBed(false);
            setSwitchCustomRent(false);
        } else if (id === 1) {
            setSwitchAllBed(false);
            setSwitchOneBed(!switchOneBed);
            setSwitchTwoBed(false);
            setSwitchCustomRent(false);
        } else if (id === 2) {
            setSwitchAllBed(false);
            setSwitchOneBed(false);
            setSwitchTwoBed(!switchTwoBed);
            setSwitchCustomRent(false);
        } else {
            setSwitchAllBed(false);
            setSwitchOneBed(false);
            setSwitchTwoBed(false);
            setSwitchCustomRent(!switchCustomRent);
        }
    };

    const parseCityName = city => {
        return city.split(',')[1].trim();
    };

    //Makes request to backend API with user Information.
    //API returns information about Taxes and Average Rent
    const calculateNetIncome = async () => {

        setModalMessage('Fetching Data From API');
        //Post request options
        const userOptions = {
            salary: salary + '',
            state,
            city,
            cityValue,
        };

        try {

            const timeoutPromise = new Promise((resolve) => {
                setTimeout(resolve, 10000, false);
            });

            const result = new Promise((resolve) => {
                postData(process.env.SERVER_URL + 'getdata', userOptions)
                    .then((result) => resolve(result));
            });

            Promise.race([result, timeoutPromise]).then((value) => {
                if (!value) {
                    setModalMessage('Error Fetching Data');
                } else {
                    if (Object.keys(value.taxes).length === 0 || Object.keys(value.average_rent).length === 0) {
                        setModalMessage('Error Fetching Data');
                    } else {
                        setIsLoading(false);
                        setResults(value);
                    }
                }
            });

        } catch (e) {
            console.log(e);
            setModalMessage('Error Fetching Data');
        }
    };

    //Change Handler for City Input
    const updateCity = (e) => {
        setCityValue(e.target.options[e.target.selectedIndex].value);
        setCity(e.target.options[e.target.selectedIndex].text.split(',')[0]);
        setState(stateNames[parseCityName(e.target.options[e.target.selectedIndex].text)]);
    };

    //Change Handler for Salary Input
    const updateSalary = (e) => {
        const pattern = /^[0-9.,]+$/;

        if (e.target.value.match(pattern)) {
            setSalary(e.target.value);
        }

    };

    //OnChange Handler for if any CostNode values changes
    const updateCostOfLivingAmount = (id, costType, amount) => {
        const totalCostIndex = totalCostsList.findIndex(x => x.costID === id);
        totalCostsList[totalCostIndex].amount = parseFloat(amount.replace(',', ''));
        totalCostsList[totalCostIndex].costType = costType;
        setTotalCostsList([...totalCostsList]);
    };

    //Remove Handler for removing Cost Node
    const removeCostOfLIving = (costID) => {
        setTotalCostsList([...totalCostsList.filter(item => item.costID !== costID)]);
    };

    //Formates number to a currency
    const currencyFormat = (num) => {
        num = Number.parseFloat(num);
        return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '' +
            '$1,');
    };

    //Calcualtes Total-Taxes from tax-results received by the API
    const totalTaxes = results.taxes.map(item => parseFloat(item.taxValue.replace(',', ''))).reduce((a, b) => a + b);

    //Calculates Total-Costs from "Additional Monthly Costs" sections
    const totalCosts = totalCostsList.length > 0 ? totalCostsList.map(item => item.amount).reduce((a, b) => a + b) * 12 : 0;

    //Rent values recieved from the API
    const averageRentDate = results.average_rent.month;
    const averageRentAllBeds = results.average_rent.allBeds;
    const averageRentOneBed = results.average_rent.oneBed;
    const averageRentTwoBed = results.average_rent.twoBeds;

    //Checks which switch is currently active and uses that value for Rent Cost
    const rentCost = Number.parseFloat((switchAllBed ? averageRentAllBeds : (switchOneBed ? averageRentOneBed : (switchTwoBed ? averageRentTwoBed : (switchCustomRent ? customRent+'' : '0')))).replace(',', '').replace('$', '')) * 12;

    return (
        <div className={'App'}>
            <div className={'titleDiv'}>
                <h2 className={'title'}>Net Income Calculator</h2>
            </div>
            <Form className={'form'} onSubmit={(e) => {
                e.preventDefault();
                setIsLoading(true);
                calculateNetIncome();
            }}>
                <div className={'inputBox'}>
                    <Row className={'row'} id={'salary'}>
                        <p className={'rowPara'}>Gross Salary (Annual)</p>
                        <InputGroup className={'inputGroup'}>
                            <Form.Control
                                type="text"
                                aria-describedby="inputGroupPrepend"
                                required
                                className={'inputCustomText'}
                                onChange={e => updateSalary(e)}
                                value={salary}
                                placeholder={'Annual Salary'}
                            />
                            <Form.Control.Feedback type="invalid">
                                Salary Required
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Row>
                    <Row className={'row'}>
                        <p className={'rowPara'}>City</p>
                        <Form.Group controlId="form.city" className={'inputGroup'}>
                            <Form.Control as="select" style={{fontSize: '19px'}} value={cityValue}
                                          onChange={(city) => updateCity(city)}>
                                <option value="albuquerque">Albuquerque, NM</option>
                                <option value="anaheim">Anaheim, CA</option>
                                <option value="anchorage">Anchorage, AK</option>
                                <option value="arlington-tx">Arlington, TX</option>
                                <option value="atlanta">Atlanta, GA</option>
                                <option value="aurora-co">Aurora, CO</option>
                                <option value="austin">Austin, TX</option>
                                <option value="bakersfield">Bakersfield, CA</option>
                                <option value="baltimore">Baltimore, MD</option>
                                <option value="birmingham">Birmingham, AL</option>
                                <option value="boston">Boston, MA</option>
                                <option value="buffalo">Buffalo, NY</option>
                                <option value="chandler">Chandler, AZ</option>
                                <option value="charlotte">Charlotte, NC</option>
                                <option value="chicago">Chicago, IL</option>
                                <option value="cincinnati">Cincinnati, OH</option>
                                <option value="cleveland">Cleveland, OH</option>
                                <option value="colorado-springs">Colorado Springs, CO</option>
                                <option value="columbus-oh">Columbus, OH</option>
                                <option value="corpus-christi">Corpus Christi, TX</option>
                                <option value="dallas">Dallas, TX</option>
                                <option value="denver">Denver, CO</option>
                                <option value="detroit">Detroit, MI</option>
                                <option value="el-paso">El Paso, TX</option>
                                <option value="fort-wayne">Fort Wayne, IN</option>
                                <option value="fort-worth">Fort Worth, TX</option>
                                <option value="fresno">Fresno, CA</option>
                                <option value="glendale-az">Glendale, AZ</option>
                                <option value="greensboro">Greensboro, NC</option>
                                <option value="henderson">Henderson, NV</option>
                                <option value="honolulu">Honolulu, HI</option>
                                <option value="houston">Houston, TX</option>
                                <option value="indianapolis">Indianapolis, IN</option>
                                <option value="jacksonville-fl">Jacksonville, FL</option>
                                <option value="jersey-city">Jersey City, NJ</option>
                                <option value="kansas-city-mo">Kansas City, MO</option>
                                <option value="las-vegas">Las Vegas, NV</option>
                                <option value="lexington">Lexington, KY</option>
                                <option value="lincoln">Lincoln, NE</option>
                                <option value="long-beach">Long Beach, CA</option>
                                <option value="los-angeles">Los Angeles, CA</option>
                                <option value="louisville">Louisville, KY</option>
                                <option value="memphis">Memphis, TN</option>
                                <option value="mesa">Mesa, AZ</option>
                                <option value="miami">Miami, FL</option>
                                <option value="milwaukee">Milwaukee, WI</option>
                                <option value="minneapolis">Minneapolis, MN</option>
                                <option value="nashville">Nashville, TN</option>
                                <option value="new-orleans">New Orleans, LA</option>
                                <option value="new-york">New York, NY</option>
                                <option value="newark">Newark, NJ</option>
                                <option value="norfolk">Norfolk, VA</option>
                                <option value="oakland">Oakland, CA</option>
                                <option value="oklahoma-city">Oklahoma City, OK</option>
                                <option value="omaha">Omaha, NE</option>
                                <option value="philadelphia">Philadelphia, PA</option>
                                <option value="phoenix">Phoenix, AZ</option>
                                <option value="pittsburgh">Pittsburgh, PA</option>
                                <option value="plano">Plano, TX</option>
                                <option value="portland-or">Portland, OR</option>
                                <option value="raleigh">Raleigh, NC</option>
                                <option value="riverside">Riverside, CA</option>
                                <option value="sacramento">Sacramento, CA</option>
                                <option value="san-antonio">San Antonio, TX</option>
                                <option value="san-diego">San Diego, CA</option>
                                <option value="san-francisco">San Francisco, CA</option>
                                <option value="san-jose">San Jose, CA</option>
                                <option value="santa-ana">Santa Ana, CA</option>
                                <option value="scottsdale">Scottsdale, AZ</option>
                                <option value="seattle">Seattle, WA</option>
                                <option value="st-louis">St. Louis, MO</option>
                                <option value="st-paul">St. Paul, MN</option>
                                <option value="st-petersburg">St. Petersburg, FL</option>
                                <option value="stockton">Stockton, CA</option>
                                <option value="tampa">Tampa, FL</option>
                                <option value="toledo">Toledo, OH</option>
                                <option value="tucson">Tucson, AZ</option>
                                <option value="tulsa">Tulsa, OK</option>
                                <option value="virginia-beach">Virginia Beach, VA</option>
                                <option value="washington">Washington, DC</option>
                                <option value="wichita">Wichita, KS</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                </div>
                <Button type={'Submit'} className={'submitButton'}>
                    Calculate Income
                </Button>
            </Form>
            <Modal show={isLoading} onHide={modalMessage === 'Error Fetching Data' ? () => setIsLoading(false) : () => {
            }}>
                {modalMessage === 'Error Fetching Data' ?
                    <Modal.Header className={'modalStyle'} closeButton>
                        <p className={'modalText'} style={{width: '100%', marginRight: '0'}}>{modalMessage}</p>
                    </Modal.Header> :
                    <ModalBody className={'modalStyle'}>
                        <p className={'modalText'}>{modalMessage}</p>
                        <Spinner animation="border"/>
                    </ModalBody>
                }
            </Modal>
            <div className={'results'}>
                <p className={'resultsTitle'}>Results</p>
                <div className={'infoBox'}>
                    <p className={'resultsSubtitle'}>
                        Tax Info
                    </p>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Federal Tax</p>
                        <p className={'costAmount'}>$ {results.taxes[0].taxValue}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>State Tax</p>
                        <p className={'costAmount'}>$ {results.taxes[1].taxValue}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Social Security Tax</p>
                        <p className={'costAmount'}>$ {results.taxes[2].taxValue}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Medicare Tax</p>
                        <p className={'costAmount'}>$ {results.taxes[3].taxValue}</p>
                    </div>
                    <a style={{marginTop: '5px'}} href={'https://salaryaftertax.com/us'} target={'_blank'}><p> Read More </p></a>
                </div>
                <div className={'infoBox'}>
                    <p className={'resultsSubtitle'}>
                        Average Monthly Rent ({averageRentDate})
                    </p>
                    <div className={'costInfo'}>
                        <div className={'rentInfo'}>
                            <p className={'costType'} style={{marginRight: '10px'}}>Average Rent All Beds</p>
                            <Form.Check
                                type="switch"
                                id="switch-all-bed"
                                label=''
                                checked={switchAllBed}
                                onChange={() => toggleRentSwitch(0)}
                            />
                        </div>
                        <p className={'costAmount'}>$ {averageRentAllBeds}</p>
                    </div>
                    <div className={'costInfo'}>
                        <div className={'rentInfo'}>
                            <p className={'costType'} style={{marginRight: '10px'}}>
                                Average Rent One Bed
                            </p>
                            <Form.Check
                                type="switch"
                                id="switch-one-bed"
                                label=''
                                checked={switchOneBed}
                                onChange={() => toggleRentSwitch(1)}
                            />
                        </div>
                        <p className={'costAmount'}>$ {averageRentOneBed}</p>
                    </div>
                    <div className={'costInfo'}>
                        <div className={'rentInfo'}>
                            <p className={'costType'} style={{marginRight: '10px'}}>Average Rent Two Beds</p>
                            <Form.Check
                                type="switch"
                                id="switch-two-bed"
                                label=''
                                checked={switchTwoBed}
                                onChange={() => toggleRentSwitch(2)}
                            />
                        </div>
                        <p className={'costAmount'}>$ {averageRentTwoBed}</p>
                    </div>
                    <div className={'costInfo'}>
                        <div className={'rentInfo'}>
                            <p className={'costType'} style={{marginRight: '10px'}}>Custom Rent</p>
                            <Form.Check
                                type="switch"
                                id="switch-custom-bed"
                                label=''
                                checked={switchCustomRent}
                                onChange={() => toggleRentSwitch(3)}
                            />
                        </div>
                        <Form.Control
                            type="text"
                            className={'rentInput'}
                            value={customRent}
                            onChange={(e) => {
                                const pattern = /^[0-9.,]+$/;
                                if (e.target.value.match(pattern)) {
                                    setCustomRent(e.target.value);
                                } else if (e.target.value.length === 0) {
                                    setCustomRent(0);
                                }
                            }}
                        />
                    </div>
                    <a style={{marginTop: '5px'}} href={'https://www.rentjungle.com/rentdata/'} target={'_blank'}><p> Read More </p></a>
                </div>
                <div className={'infoBox costOfLiving'}>
                    <p className={'resultsSubtitle'}>
                        Additional Monthly Costs (Optional)
                    </p>
                    {totalCostsList.map(item => <CostNode
                        costType={item.costType}
                        costAmount={item.amount}
                        amount={item.amount}
                        key={item.costID}
                        costID={item.costID}
                        removeNode={(costID) => removeCostOfLIving(costID)}
                        onChange={(costID, costType, amount) => updateCostOfLivingAmount(costID, costType, amount)}
                    />)}
                </div>
                <Button className={'addCostButton'} onClick={() => {
                    setTotalCostsList([...totalCostsList, {costID: totalCostsList.length}]);
                }}>
                    Add Cost
                </Button>
                <div className={'infoBox totalResults'}>
                    <p className={'resultsSubtitle'}>
                        Total (Annual)
                    </p>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Gross Income</p>
                        <p className={'costAmount'}>{currencyFormat(salary)}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Total Taxes</p>
                        <p className={'costAmount'}>- {currencyFormat(totalTaxes)}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Total Costs</p>
                        <p className={'costAmount'}>{totalCosts > 0 ? '- ' + currencyFormat(totalCosts) : '$0.00'}</p>
                    </div>
                    <div className={'costInfo'}>
                        <p className={'costType'}>Total Rent</p>
                        <p className={'costAmount'}>{rentCost > 0 ? '- ' + currencyFormat(rentCost) : '$0.00'}</p>
                    </div>
                    <div className={'costInfo totalCost'}>
                        <p className={'costType totalType'}>Net Income</p>
                        <p className={'costAmount totalAmount'}>{currencyFormat(salary - rentCost - totalCosts - totalTaxes)} </p>
                    </div>
                </div>
            </div>
            <Modal show={showTutorial} onHide={() => setShowTutorial(false)}>
                <Modal.Header className={'modalStyle'} closeButton>
                    <p className={'modalText'} style={{width: '100%', marginRight: '0'}}>Disclaimer!</p>
                </Modal.Header>
                <ModalBody className={'modalStyle'}>
                    <p className={'modalText'}>Please keep in mind that there are government websites available which provide up to date information and that changes in policies and tax laws might not have been considered</p>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default App;
