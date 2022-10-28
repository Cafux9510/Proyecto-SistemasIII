import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

export class BarChart extends Component {

    constructor(props) {
        super(props);

        this.basicData = {
            labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre','Noviembre'],
            datasets: [
                {
                    label: 'Ingresos',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40, 55, 40]
                },
                {
                    label: 'Egresos',
                    backgroundColor: '#FFA726',
                    data: [28, 48, 40, 19, 86, 27, 90, 55, 40]
                }
            ]
        };

       

        this.options = this.getLightTheme();
    }

    getLightTheme() {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        let horizontalOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

     

        

        return {
            basicOptions,
            horizontalOptions,
           
        }
    }

    render() {
        const { basicOptions, horizontalOptions } = this.options;

        return (
            <div>
                <div>
                    <h5>Ingresos y Egresos en Ciclo Lectivo</h5>
                    <Chart type="bar" data={this.basicData} options={basicOptions} />
                </div> 

                {/* <div className="card">
                    <h5>Ingresos y Egresos en Ciclo Lectivo</h5>
                    <Chart type="bar" data={this.basicData} options={horizontalOptions} />
                </div> */}
            </div>
        )
    }
}
                