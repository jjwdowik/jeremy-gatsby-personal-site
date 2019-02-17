import React from "react";
import { navigateTo } from "gatsby-link";
import Recaptcha from "react-google-recaptcha";
import Layout from '../../components/Layout'

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: false};
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRecaptcha = value => {
    this.setState({ "g-recaptcha-response": value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    if(this.state["g-recaptcha-response"] !== undefined) {
      this.setState({error: false});
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": form.getAttribute("name"),
          ...this.state
        })
      })
        .then(() => navigateTo(form.getAttribute("action")))
        .catch(error => alert(error));
    } else {
      this.setState({error: true, errorMessage: "Please fill out the reCAPTCHA verification."});
    }
  };

  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1>reCAPTCHA 2</h1>
              <form
                name="contact-recaptcha"
                method="post"
                action="/contact/thanks/"
                data-netlify-recaptcha="true"
                data-netlify="true"
                onSubmit={this.handleSubmit}
              >
                <noscript>
                  <p>This form won’t work with Javascript disabled</p>
                </noscript>
                <p>
                  <label>
                    Your name:<br />
                    <input type="text" name="name" onChange={this.handleChange} required={true} />
                  </label>
                </p>
                <p>
                  <label>
                    Your email:<br />
                    <input type="email" name="email" onChange={this.handleChange} required={true} />
                  </label>
                </p>
                <p>
                  <label>
                    Message:<br />
                    <textarea name="message" onChange={this.handleChange} required={true} />
                  </label>
                </p>
                <Recaptcha
                  ref="recaptcha"
                  sitekey={RECAPTCHA_KEY}
                  onChange={this.handleRecaptcha}
                  required={true}
                />
                <p>
                  <button type="submit">Send</button>
                </p>
                <p>
                  {this.state.error &&
                    this.state.errorMessage
                  }
                </p>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
